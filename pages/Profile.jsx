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

//#region import Constants
import { User_Placeholder } from "../constants/content/PlaceholderData";
import { getUID } from "../constants/storage";

import { wait } from "../constants/wait";
import { arraySplitter } from "../constants";
import { getLangs } from "../constants/langs";
import { getPlainText } from "../constants/utils/tts";
import { share } from "../constants/share";
import {
    alertForRoles,
    buildProfileContent,
    followUser,
    generatePlaceholderContent,
    generateProfile,
    getIfClientIsAdmin,
    loadUser,
} from "../constants/content/profile";

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
import SVG_MK from "../assets/svg/MK";

let UID = null;
export default function Profile({ navigation, route, openContextMenu }) {
    const scrollRef = useRef();

    let LOADING = false;
    let followPressed = false;

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadUserData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [following, setFollowing] = useState(false);
    const [canFollow, setCanFollow] = useState(false);
    const [postEventList, setPostEventList] = useState([]);

    const [clientIsAdmin, setClintIsAdmin] = useState(false);

    const loadUserData = async () => {
        if (LOADING) return;
        LOADING = true;

        const uid = await getUID();
        UID = uid;

        const isClient = uid === id;
        setCanFollow(!isClient);

        const user = await loadUser(id, isClient, false);
        const userData = generateProfile(user);

        setFollowing(userData.follower.includes(UID));
        setUser(userData);

        // For loading time - fill with Placeholder Posts
        setPostEventList(
            generatePlaceholderContent(userData.posts, userData.events)
        );

        // Content data of profile
        const sortedContentList = await buildProfileContent(
            userData,
            !isClient
        );
        setPostEventList(sortedContentList);

        LOADING = false;
    };

    useEffect(() => {
        loadUserData();

        const adm = getIfClientIsAdmin();
        setClintIsAdmin(adm);
    }, []);

    //#region Fkt: Follow/Unfollow
    const handleFollowPress = async () => {
        if (user.isBanned || followPressed) return;
        followPressed = true;

        const rsp = await followUser(id, following, UID);

        if (!rsp) {
            followPressed = false;
            return;
        }

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
                    let newFollowerList = userPrev.follower.concat([UID]);
                    return {
                        ...userPrev,
                        follower: newFollowerList,
                    };
                });
            }
            return !prev;
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
                                onPress={() => alertForRoles(user)}>
                                <SVG_Admin
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </Pressable>
                        ) : null}
                        {user.isMod ? (
                            <Pressable
                                style={styles.nameIcon}
                                onPress={() => alertForRoles(user)}>
                                <SVG_Verify
                                    fill={style.colors.red}
                                    style={style.allMax}
                                />
                            </Pressable>
                        ) : null}
                        {user.isMK ? (
                            <Pressable
                                style={styles.nameIcon}
                                onPress={() => alertForRoles(user)}>
                                <SVG_MK
                                    fill={"#146314"}
                                    style={[style.allMax]}
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
                        <FollowButton
                            checked={following}
                            onPress={async () => handleFollowPress()}
                        />
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
                                                !item.group
                                                    ? style.profileContentShadowPost
                                                    : item.group === 2
                                                    ? style.profileContentShadowChallenge
                                                    : style.profileContentShadowGroup,
                                            ]}
                                            onPress={() => {
                                                if (item.id === 0) return;
                                                navigation.push("postView", {
                                                    id: item.id,
                                                });
                                            }}
                                        />
                                    ) : (
                                        //#region Event Preview Card
                                        <EventPreview
                                            key={itemKey}
                                            data={item}
                                            style={[
                                                styles.contentItem,
                                                style.profileContentShadowEvent,
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
                        onShare={() => share(2, id, user.name)}
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
    },
    nameScore: {
        marginRight: style.defaultMmd,

        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: "#ca55e7",
        shadowOffset: {
            width: 0,
            height: -2,
        },
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
