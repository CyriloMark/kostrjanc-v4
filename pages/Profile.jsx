import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
    Platform,
    Alert,
} from "react-native";

import * as style from "../styles";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

//#region import Constants
import { User_Placeholder } from "../constants/content/PlaceholderData";
import { getData, storeData } from "../constants/storage";

import { wait } from "../constants/wait";
import { arraySplitter, sortArrayByDate } from "../constants";
import { getLangs } from "../constants/langs";
import makeRequest from "../constants/request";
import { getPlainText } from "../constants/content/tts";
import { sendFollowerPushNotification } from "../constants/notifications/follower";

//#region import Components
import BackHeader from "../components/BackHeader";
import InteractionBar from "../components/InteractionBar";
import FollowButton from "../components/profile/FollowButton";
import PostPreview from "../components/profile/PostPreview";
import EventPreview from "../components/profile/EventPreview";
import Refresh from "../components/RefreshControl";
import ScoreCounter from "../components/profile/ScoreCounter";

//#region import SVGs
import SVG_Admin from "../assets/svg/Admin";
import SVG_Verify from "../assets/svg/Moderator";

let UID = null;
export default function Profile({ navigation, route, openContextMenu }) {
    const scrollRef = useRef();

    let followPressed = false;

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadUser();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [following, setFollowing] = useState(false);
    const [canFollow, setCanFollow] = useState(false);
    const [postEventList, setPostEventList] = useState([]);

    //#region Load Data
    const setUserData = data => {
        if (data["isBanned"]) {
            if (data.isBanned) {
                setUser({
                    ...User_Placeholder,
                    isBanned: true,
                });
                return;
            }
        }

        let userData = {
            ...data,
            follower: data["follower"] ? data.follower : [],
            following: data["following"] ? data.following : [],
        };

        setFollowing(userData.follower.includes(UID));

        const hasPosts = data["posts"] ? true : false;
        const hasEvents = data["events"] ? true : false;

        setUser(userData);

        const db = getDatabase();
        let postEventDatas = [];

        if (hasPosts) {
            const p = data.posts;

            for (let i = 0; i < p.length; i++) {
                get(child(ref(db), `posts/${p[i]}`))
                    .then(postSnap => {
                        if (postSnap.exists()) {
                            const postData = postSnap.val();
                            if (!postData.isBanned && !postData.group)
                                postEventDatas.push(postData);

                            // if (!postData.isBanned) {
                            //     setUser(user => {
                            //         return {
                            //             ...user,
                            //             posts: user.posts.splice(
                            //                 user.posts.indexOf(p[i]),
                            //                 1
                            //             ),
                            //         };
                            //     });
                            // } else postEventDatas.push(postData);
                            if (i === p.length - 1 && !hasEvents)
                                setPostEventList(
                                    sortArrayByDate(postEventDatas).reverse()
                                );
                        }
                    })
                    .catch(error =>
                        console.log(
                            "error pages/Profile.jsx",
                            "get post data",
                            error.code
                        )
                    );
            }
        }

        if (hasEvents) {
            const e = data.events;

            for (let i = 0; i < e.length; i++) {
                get(child(ref(db), "events/" + e[i]))
                    .then(eventSnap => {
                        if (eventSnap.exists()) {
                            const eventData = eventSnap.val();
                            if (!eventData.isBanned && !eventData.group)
                                postEventDatas.push(eventData);

                            if (i === e.length - 1)
                                setPostEventList(
                                    sortArrayByDate(postEventDatas).reverse()
                                );
                        }
                    })
                    .catch(error =>
                        console.log(
                            "error pages/Profile.jsx",
                            "get event data",
                            error.code
                        )
                    );
            }
        }
    };

    const loadUser = () => {
        const db = getDatabase();
        get(child(ref(db), "users/" + id)).then(userSnap => {
            if (!userSnap.exists()) return;

            let userData = userSnap.val();
            setUserData(userData);
        });
    };

    useEffect(() => {
        getData("userId").then(uid => {
            if (uid) {
                UID = uid;
                if (uid === id) {
                    getData("userData").then(userData => {
                        if (userData) setUserData(userData);
                        else loadUser();
                    });
                } else {
                    setCanFollow(true);
                    loadUser();
                }
            } else {
                UID = getAuth().currentUser.uid;
                setCanFollow(true);
                loadUser();
            }
        });
        getIfAdmin();
    }, []);
    //#endregion

    //#region Fkt: alertForRoles
    const alertForRoles = () => {
        Alert.alert(
            user.name,
            `${user.name} ${getLangs("profile_role_sub_0")} ${
                user.isAdmin === true
                    ? getLangs("profile_role_admin")
                    : user.isMod === true
                    ? getLangs("profile_role_mod")
                    : ""
            } ${getLangs("profile_role_sub_1")}`
        );
    };

    const [clientIsAdmin, setClintIsAdmin] = useState(false);
    const getIfAdmin = async () => {
        await getData("userIsAdmin").then(isAdmin => {
            if (isAdmin === null) return setClintIsAdmin(false);
            return setClintIsAdmin(isAdmin);
        });
    };

    //#region Fkt: Follow/Unfollow
    const follow = () => {
        if (user.isBanned || followPressed) return;
        followPressed = true;

        const body = {
            user: id,
            follow: false,
            unfollow: false,
        };

        if (following) body.unfollow = true;
        else body.follow = true;

        makeRequest("/user/follow", body)
            .then(rsp => {
                if (rsp.code === 202) {
                    setFollowing(prev => {
                        // Remove from Follower List
                        if (prev)
                            setUser(userPrev => {
                                let newFollowerList = userPrev.follower.filter(
                                    el => el != UID
                                );
                                return {
                                    ...userPrev,
                                    follower: newFollowerList,
                                };
                            });
                        // Add to Follower List
                        else {
                            // Update user state
                            setUser(userPrev => {
                                let newFollowerList = userPrev.follower.concat([
                                    UID,
                                ]);
                                return {
                                    ...userPrev,
                                    follower: newFollowerList,
                                };
                            });
                            // Send notification
                            sendFollowerPushNotification(id, UID);
                        }
                        return !prev;
                    });
                    followPressed = false;
                } else
                    Alert.alert(
                        getLangs("profile_onfollow_error_title"),
                        getLangs("profile_onfollow_error_sub") + rsp,
                        [
                            {
                                isPreferred: true,
                                text: "Ok",
                                style: "default",
                            },
                        ]
                    );
            })
            .catch(error => {
                console.log(
                    "error in pages/Profile.jsx",
                    "makeRequest user/follow",
                    error
                );
                Alert.alert(
                    getLangs("profile_onfollow_error_title"),
                    getLangs("profile_onfollow_error_sub") + error,
                    [
                        {
                            isPreferred: true,
                            text: "Ok",
                            style: "default",
                        },
                    ]
                );
            });
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {
                //#region Page Header
            }
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() =>
                    scrollRef.current.scrollTo({
                        y: 0,
                        animated: true,
                    })
                }>
                <BackHeader
                    // title={user.name}
                    title={""}
                    onBack={() => navigation.goBack()}
                    onReload={loadUser}
                    showReload
                />
            </Pressable>

            <ScrollView
                scrollEnabled
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                keyboardDismissMode="interactive"
                snapToAlignment="center"
                snapToEnd
                ref={scrollRef}
                style={[style.container, style.pH, style.oVisible]}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshControl={
                    Platform.OS === "ios" ? (
                        <Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : null
                }>
                {
                    //#region Profile: Header Container
                }
                <View style={{ alignItems: "center" }}>
                    {
                        //#region Profile: Picture
                    }
                    <View
                        style={[
                            style.shadowSec,
                            {
                                borderRadius: 100,
                                shadowOpacity: 0.75,
                                shadowRadius: 15,
                            },
                        ]}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate("imgFull", {
                                    uri: user.pbUri,
                                })
                            }
                            style={[
                                style.allCenter,
                                styles.imgContainer,
                                style.oHidden,
                            ]}>
                            <Image
                                source={{
                                    uri: user.pbUri,
                                }}
                                style={[style.container, style.allMax]}
                                resizeMode="cover"
                            />
                        </Pressable>
                    </View>

                    {
                        //#region Profile: Name
                    }
                    <View style={styles.nameContainer}>
                        {user.isAdmin ? (
                            <Pressable
                                style={styles.nameIcon}
                                onPress={alertForRoles}>
                                <SVG_Admin
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </Pressable>
                        ) : null}
                        {user.isMod ? (
                            <Pressable
                                style={styles.nameIcon}
                                onPress={alertForRoles}>
                                <SVG_Verify
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </Pressable>
                        ) : null}
                        {user.score != null ? (
                            <ScoreCounter
                                count={user.score}
                                style={styles.nameScore}
                                userName={user.name}
                            />
                        ) : null}

                        <Text
                            style={[
                                style.tWhite,
                                style.Ttitle2,
                                style.readableText,
                            ]}
                            onPress={() =>
                                openContextMenu(getPlainText(user.name))
                            }>
                            {user.name}
                        </Text>
                    </View>

                    {
                        //#region Profile: Description
                    }
                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                style.readableText,
                            ]}
                            onPress={() =>
                                openContextMenu(getPlainText(user.description))
                            }>
                            {user.description}
                        </Text>
                    </View>
                </View>

                {
                    //#region Follow/Unfollow Button
                }
                {canFollow ? (
                    <View style={styles.followButton}>
                        <FollowButton checked={following} onPress={follow} />
                    </View>
                ) : null}

                {
                    //#region Stats Container
                }
                <View style={styles.sectionContainer}>
                    <View style={styles.statsContainer}>
                        {
                            //#region Stats: Follower
                        }
                        <Pressable
                            onPress={() =>
                                navigation.push("userList", {
                                    users: user.follower,
                                    title: getLangs("profile_follower"),
                                    needData: true,
                                })
                            }
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {user.follower.length}
                            </Text>
                            <Text
                                style={[
                                    style.tBlue,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_follower")}
                            </Text>
                        </Pressable>

                        {
                            //#region Stats: Following
                        }
                        <Pressable
                            onPress={() =>
                                navigation.push("userList", {
                                    users: user.following,
                                    title: getLangs("profile_following"),
                                    needData: true,
                                })
                            }
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {user.following.length}
                            </Text>
                            <Text
                                style={[
                                    style.tBlue,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_following")}
                            </Text>
                        </Pressable>

                        {
                            //#region Stats: Content
                        }
                        <View
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {postEventList.length}
                            </Text>
                            <Text
                                style={[
                                    style.tBlue,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_contentlist")}
                            </Text>
                        </View>
                    </View>
                </View>

                {
                    //#region Content Mapping
                }
                <View style={styles.sectionContainer}>
                    {arraySplitter(postEventList, 4).map((list, listKey) => (
                        <View
                            key={listKey}
                            style={styles.contentItemListContainer}>
                            {list.map((item, itemKey) =>
                                item !== null ? (
                                    item.type === 0 ? (
                                        //#region Post Preview Card
                                        <PostPreview
                                            key={itemKey}
                                            data={item}
                                            style={[
                                                styles.contentItem,
                                                style.shadowSecSmall,
                                            ]}
                                            onPress={() =>
                                                navigation.push("postView", {
                                                    id: item.id,
                                                })
                                            }
                                        />
                                    ) : (
                                        //#region Event Preview Card
                                        <EventPreview
                                            key={itemKey}
                                            data={item}
                                            style={[
                                                styles.contentItem,
                                                style.shadowSecSmall,
                                            ]}
                                            onPress={() =>
                                                navigation.push("eventView", {
                                                    id: item.id,
                                                })
                                            }
                                        />
                                    )
                                ) : (
                                    <View
                                        key={itemKey}
                                        style={styles.contentItem}
                                    />
                                )
                            )}
                        </View>
                    ))}
                </View>

                {
                    //#region Interaction Container
                }
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {getLangs("interactionbar_title")}
                    </Text>
                    <InteractionBar
                        style={{ marginTop: style.defaultMsm }}
                        ban={clientIsAdmin}
                        share
                        warn
                        onWarn={() =>
                            navigation.navigate("report", {
                                item: user,
                                type: 2,
                            })
                        }
                        onBan={() =>
                            navigation.navigate("ban", {
                                item: user,
                                type: 2,
                                id: id,
                            })
                        }
                    />
                </View>

                <View style={styles.sectionContainer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    interactionBarContainer: {
        position: "absolute",
        width: "100%",
        bottom: style.defaultMsm,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    imgContainer: {
        maxWidth: 152,
        maxHeight: 152,
        borderRadius: 100,
        aspectRatio: 1,
    },
    nameContainer: {
        flexDirection: "row",
        marginTop: style.defaultMmd,
        ...style.allCenter,
    },
    nameIcon: {
        width: 24,
        height: 24,
        marginRight: style.defaultMmd,
        marginTop: style.defaultMsm,
    },
    nameScore: {
        marginTop: style.defaultMsm,
        marginRight: style.defaultMmd,
    },
    textContainer: {
        marginTop: style.defaultMmd,
    },

    followButton: {
        marginTop: style.defaultMlg,
        alignSelf: "center",
    },

    statsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
    },
    statElementContainer: {
        flexDirection: "column",
    },

    contentItemListContainer: {
        width: "100%",
        flexDirection: "row",
    },
    contentItem: {
        margin: style.defaultMsm,
        flex: 1,
        borderRadius: 10,
    },
});
