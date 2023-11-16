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

import * as style from "../../styles";

import { getDatabase, ref, get, child, set } from "firebase/database";
import { getAuth } from "firebase/auth";

import { User_Placeholder } from "../../constants/content/PlaceholderData";

import { wait } from "../../constants/wait";
import { arraySplitter, sortArrayByDate } from "../../constants";
import { storeData, getData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import { checkIfTutorialNeeded } from "../../constants/tutorial";

import BackHeader from "../../components/BackHeader";
import PostPreview from "../../components/profile/PostPreview";
import EventPreview from "../../components/profile/EventPreview";
import EditProfileButton from "../../components/profile/EditProfileButton";
import Refresh from "../../components/RefreshControl";

import SVG_Admin from "../../assets/svg/Admin";
import SVG_Verify from "../../assets/svg/Moderator";

import AnimatedPaidBatch from "../../components/content/AnimatedPaidBatch";

const DAYS_TO_DELETE_EVENTS = 31;

export default function UserProfile({ navigation, onTut }) {
    const scrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadUser();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [user, setUser] = useState(User_Placeholder);
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

        const hasPosts = data["posts"] ? true : false;
        const hasEvents = data["events"] ? true : false;

        setUser(userData);

        const db = getDatabase();
        let postEventDatas = [];
        if (hasPosts) {
            const p = data.posts;

            for (let i = 0; i < p.length; i++) {
                get(child(ref(db), "posts/" + p[i]))
                    .then(postSnap => {
                        if (postSnap.exists()) {
                            const postData = postSnap.val();
                            if (!postData.isBanned)
                                postEventDatas.push(postData);
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

                            const xDays =
                                24 * 1000 * 60 * 60 * DAYS_TO_DELETE_EVENTS;
                            if (Date.now() - eventData.ending >= xDays) {
                                set(
                                    ref(db, `events/${e[i]}/isBanned`),
                                    true
                                ).catch(error =>
                                    console.log(
                                        "error pages/main/UserProfile.jsx",
                                        "set Event isBanned when to long ago",
                                        error.code
                                    )
                                );
                            } else if (!eventData.isBanned)
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
        let uid = "";
        getData("userId")
            .then(id => {
                if (!id) uid = getAuth().currentUser.uid;
                else uid = id;
            })
            .finally(() => {
                const db = getDatabase();
                get(child(ref(db), "users/" + uid)).then(userSnap => {
                    if (!userSnap.exists()) return;

                    let userData = userSnap.val();
                    setUserData(userData);
                    storeData("userData", userData);
                });
            });
    };

    useEffect(() => {
        getData("userData").then(userData => {
            if (userData) setUserData(userData);
            else loadUser();
        });
        checkForTutorial();
    }, []);

    const checkForTutorial = async () => {
        const needTutorial = await checkIfTutorialNeeded(2);
        if (needTutorial) onTut(2);
    };

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
                ref={scrollRef}
                style={[style.container, style.pH, style.oVisible]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd
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

                    {/* Name */}
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
                        ) : user.isMod ? (
                            <Pressable
                                style={styles.nameIcon}
                                onPress={alertForRoles}>
                                <SVG_Verify
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </Pressable>
                        ) : null}
                        {/* <Pressable
                            style={{ marginRight: style.defaultMmd }}
                            onPress={() => console.log("test")}>
                            <AnimatedPaidBatch />
                        </Pressable> */}

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
                                item !== null ? (
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

                <View style={styles.editButton}>
                    <EditProfileButton
                        title={getLangs("profile_editbuttontext")}
                        checked
                        onPress={() =>
                            navigation.navigate("editProfile", {
                                userData: user,
                            })
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
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

    editButton: {
        marginVertical: style.defaultMlg,
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
        ...style.shadowSecSmall,
    },
});
