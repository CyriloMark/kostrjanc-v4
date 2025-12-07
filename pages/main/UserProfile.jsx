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

import * as style from "../../styles";

//#region import Constants
import { User_Placeholder } from "../../constants/content/PlaceholderData";

import { wait } from "../../constants/wait";
import { arraySplitter } from "../../constants";
import { getUID } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import {
    alertForRoles,
    buildProfileContent,
    generatePlaceholderContent,
    generateProfile,
    loadUser,
} from "../../constants/content/profile";
import { checkForTutorial } from "../../constants/tutorial";

//#region import Components
import BackHeader from "../../components/BackHeader";
import PostPreview from "../../components/profile/PostPreview";
import EventPreview from "../../components/profile/EventPreview";
import EditProfileButton from "../../components/profile/EditProfileButton";
import Refresh from "../../components/RefreshControl";
import ScoreCounter from "../../components/profile/ScoreCounter";

//#region import SVGs
import SVG_Admin from "../../assets/svg/Admin";
import SVG_Verify from "../../assets/svg/Moderator";
import SVG_MK from "../../assets/svg/MK";

export default function UserProfile({ navigation, onTut }) {
    const scrollRef = useRef();

    let LOADING = false;

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadUserData(true);

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [user, setUser] = useState(User_Placeholder);
    const [postEventList, setPostEventList] = useState([]);

    const loadUserData = async forceFetch => {
        if (LOADING) return;
        LOADING = true;

        const uid = await getUID();

        const user = await loadUser(uid, true, forceFetch);
        const userData = generateProfile(user);

        setUser(userData);

        // For loading time - fill with Placeholder Posts
        setPostEventList(
            generatePlaceholderContent(userData.posts, userData.events)
        );

        // Content data of profile
        const sortedContentList = await buildProfileContent(
            userData,
            false,
            forceFetch,
            setPostEventList
        );
        setPostEventList(sortedContentList);

        LOADING = false;
    };

    useEffect(() => {
        loadUserData(false);

        checkForTutorial(2).then(rsp => {
            if (rsp) onTut(2);
        });
    }, []);
    //#endregion

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
                {
                    //#region Header Container
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
                                    style={[style.allMax]}
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

                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {user.name}
                        </Text>
                    </View>

                    {
                        //#region Profile: Description
                    }
                    <View style={styles.textContainer}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {user.description}
                        </Text>
                    </View>
                </View>

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
                    //#region Edit Button
                }
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
    },
});
