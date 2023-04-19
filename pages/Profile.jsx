import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
    Platform,
} from "react-native";

import * as style from "../styles";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

import { User_Placeholder } from "../constants/content/PlaceholderData";
import { getData, storeData } from "../constants/storage";

import { wait } from "../constants/wait";
import { arraySplitter, sortArrayByDate } from "../constants";
import { getLangs } from "../constants/langs";

import BackHeader from "../components/BackHeader";
import InteractionBar from "../components/InteractionBar";
import FollowButton from "../components/profile/FollowButton";
import PostPreview from "../components/profile/PostPreview";
import EventPreview from "../components/profile/EventPreview";
import Refresh from "../components/RefreshControl";

import SVG_Admin from "../assets/svg/Admin";
import SVG_Verify from "../assets/svg/Moderator";

let UID = null;
export default function Profile({ navigation, route }) {
    const scrollRef = useRef();

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
                            if (!postData.isBanned)
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
                            if (!eventData.isBanned)
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
            storeData(`user_${id}`, userData);
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

    const [clientIsAdmin, setClintIsAdmin] = useState(false);
    const getIfAdmin = async () => {
        await getData("userIsAdmin").then(isAdmin => {
            if (isAdmin === null) return setClintIsAdmin(false);
            return setClintIsAdmin(isAdmin);
        });
    };

    const follow = () => {
        if (user.isBanned) return;

        const db = getDatabase();
        get(child(ref(db), "users/" + UID))
            .then(userSnap => {
                if (userSnap.exists()) {
                    const userData = userSnap.val();

                    let f = [];
                    if (userSnap.hasChild("following")) f = userData.following;

                    if (!following) f.push(id);
                    else f.splice(f.indexOf(id), 1);

                    set(ref(db, "users/" + UID), {
                        ...userData,
                        following: f,
                    }).catch(error =>
                        console.log(
                            "error pages/Profile.jsx",
                            "follow setuser",
                            error.code
                        )
                    );
                }
            })
            .catch(error =>
                console.log(
                    "error pages/Profile.jsx",
                    "follow get local user",
                    error.code
                )
            );
        get(child(ref(db), "users/" + id))
            .then(userSnap => {
                if (userSnap.exists()) {
                    const userData = userSnap.val();

                    let f = [];
                    if (userSnap.hasChild("follower")) f = userData.follower;

                    if (!following) f.push(UID);
                    else f.splice(f.indexOf(UID), 1);

                    setUser(data => {
                        return {
                            ...data,
                            follower: f,
                        };
                    });

                    set(ref(db, "users/" + id), {
                        ...userData,
                        follower: f,
                    }).catch(error =>
                        console.log(
                            "error pages/Profile.jsx",
                            "follow setuser",
                            error.code
                        )
                    );
                }
            })
            .catch(error =>
                console.log(
                    "error pages/Profile.jsx",
                    "follow get local user",
                    error.code
                )
            )
            .finally(() => setFollowing(val => !val));
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
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
                {/* Header Container */}
                <View style={{ alignItems: "center" }}>
                    {/* Pb */}
                    <Pressable
                        onPress={() =>
                            navigation.navigate("imgFull", { uri: user.pbUri })
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

                    {/* Name */}
                    <View style={styles.nameContainer}>
                        {user.isAdmin ? (
                            <View style={styles.nameIcon}>
                                <SVG_Admin
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </View>
                        ) : user.isMod ? (
                            <View style={styles.nameIcon}>
                                <SVG_Verify
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </View>
                        ) : null}

                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {user.name}
                        </Text>
                    </View>

                    {/* Description */}
                    <View style={styles.textContainer}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {user.description}
                        </Text>
                    </View>
                </View>

                {canFollow ? (
                    <View style={styles.followButton}>
                        <FollowButton checked={following} onPress={follow} />
                    </View>
                ) : null}

                {/* Stats Container */}
                <View style={styles.sectionContainer}>
                    <View style={styles.statsContainer}>
                        {/* Follower */}
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
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_follower")}
                            </Text>
                        </Pressable>

                        {/* Following */}
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
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_following")}
                            </Text>
                        </Pressable>

                        {/* Content */}
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
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("profile_contentlist")}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.sectionContainer}>
                    {arraySplitter(postEventList, 2).map((list, listKey) => (
                        <View
                            key={listKey}
                            style={styles.contentItemListContainer}>
                            {list.map((item, itemKey) =>
                                item.type === 0 ? (
                                    <PostPreview
                                        key={itemKey}
                                        data={item}
                                        style={styles.contentItem}
                                        onPress={() =>
                                            navigation.push("postView", {
                                                id: item.id,
                                            })
                                        }
                                    />
                                ) : (
                                    <EventPreview
                                        key={itemKey}
                                        data={item}
                                        style={styles.contentItem}
                                        onPress={() =>
                                            navigation.push("eventView", {
                                                id: item.id,
                                            })
                                        }
                                    />
                                )
                            )}
                        </View>
                    ))}
                </View>

                {/* Interaction Container */}
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
    },
});
