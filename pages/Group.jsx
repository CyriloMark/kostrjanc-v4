import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from "react-native";

import * as style from "../styles";

import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set } from "firebase/database";

import {
    Group_Placeholder,
    User_Placeholder,
} from "../constants/content/PlaceholderData";
import { wait } from "../constants/wait";
import { getLangs } from "../constants/langs";
import { getData } from "../constants/storage";

import BackHeader from "../components/BackHeader";
import Refresh from "../components/RefreshControl";
import JoinButton from "../components/groups/JoinButton";

export default function Group({ navigation, route }) {
    const scrollRef = useRef();

    let joining = false;
    let uid = null;

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { groupId } = route.params;

    const [group, setGroup] = useState(Group_Placeholder);
    const [joined, setJoined] = useState(false);

    const loadData = () => {
        get(child(ref(getDatabase()), `groups/${groupId}`))
            .then(groupSnap => {
                if (groupSnap.exists()) {
                    const groupData = groupSnap.val();
                    if (!groupData.isBanned) setGroup(groupData);
                }
            })
            .catch(error =>
                console.log("error loadData get", "pages/Group.jsx", error.code)
            );
    };

    useEffect(() => {
        loadData();
        checkIfJoined();
    }, []);

    const join = () => {
        if (joining || group.isBanned) return;
        joining = true;

        uid = getAuth().currentUser.uid;

        const db = getDatabase();

        //#region Run this when User is not joined in Group
        // Get Members List
        if (!joined)
            get(child(ref(db), `groups/${groupId}/members`))
                .then(membersSnap => {
                    let members = [];
                    if (membersSnap.exists()) members = membersSnap.val();

                    members.push(uid);

                    // Override Members List
                    set(ref(db, `groups/${groupId}/members`), members)
                        .then(() => {
                            // Get USERS Group List
                            get(child(ref(db), `users/${uid}/groups`))
                                .then(groupsSnap => {
                                    let groups = [];
                                    if (groupsSnap.exists())
                                        groups = groupsSnap.val();
                                    groups.push(groupId);
                                    // Override Users Group List
                                    set(ref(db, `users/${uid}/groups`), groups)
                                        .then(() => {
                                            // Change Client UI
                                            setJoined(true);
                                            setGroup(prev => {
                                                let members = prev.members
                                                    ? prev.members
                                                    : [];
                                                members.push(uid);
                                                return {
                                                    ...prev,
                                                    members: members,
                                                };
                                            });
                                            joining = false;
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error join set users group list",
                                                "pages/Group.jsx",
                                                error.code
                                            )
                                        );
                                })
                                .catch(error =>
                                    console.log(
                                        "error join get users group list",
                                        "pages/Group.jsx",
                                        error.code
                                    )
                                );
                        })
                        .catch(error =>
                            console.log(
                                "error join set group members",
                                "pages/Group.jsx",
                                error.code
                            )
                        );
                })
                .catch(error =>
                    console.log(
                        "error join get group members list",
                        "pages/Group.jsx",
                        error.code
                    )
                );
        //#endregion
        else
            get(child(ref(db), `groups/${groupId}/members`))
                .then(membersSnap => {
                    let members = [];
                    if (membersSnap.exists()) members = membersSnap.val();

                    members.splice(members.indexOf(uid), 1);

                    // Override Members List
                    set(ref(db, `groups/${groupId}/members`), members)
                        .then(() => {
                            // Get USERS Group List
                            get(child(ref(db), `users/${uid}/groups`))
                                .then(groupsSnap => {
                                    let groups = [];
                                    if (groupsSnap.exists())
                                        groups = groupsSnap.val();

                                    groups.splice(groups.indexOf(groupId), 1);

                                    // Override Users Group List
                                    set(ref(db, `users/${uid}/groups`), groups)
                                        .then(() => {
                                            setJoined(false);
                                            setGroup(prev => {
                                                let members = prev.members;
                                                members.splice(
                                                    members.indexOf(uid),
                                                    1
                                                );
                                                return {
                                                    ...prev,
                                                    members: members,
                                                };
                                            });
                                            joining = false;
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error unjoin set users group list",
                                                "pages/Group.jsx",
                                                error.code
                                            )
                                        );
                                })
                                .catch(error =>
                                    console.log(
                                        "error unjoin get users group list",
                                        "pages/Group.jsx",
                                        error.code
                                    )
                                );
                        })
                        .catch(error =>
                            console.log(
                                "error unjoin set group members",
                                "pages/Group.jsx",
                                error.code
                            )
                        );
                })
                .catch(error =>
                    console.log(
                        "error unjoin get group members list",
                        "pages/Group.jsx",
                        error.code
                    )
                );
    };

    const checkIfJoined = async () => {
        joining = true;
        if (!uid) uid = getAuth().currentUser.uid;

        get(child(ref(getDatabase()), `users/${uid}/groups`))
            .then(gSnap => {
                if (gSnap.exists())
                    if (gSnap.val().includes(groupId)) setJoined(true);
            })
            .finally(() => (joining = false));
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
                    // title={post.title}
                    title={""}
                    onBack={() => navigation.goBack()}
                    onReload={loadData}
                    showReload
                />
            </Pressable>

            <ScrollView
                scrollEnabled
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInset
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
                    <View
                        style={[
                            style.shadowSec,
                            {
                                borderRadius: 25,
                                shadowOpacity: 0.33,
                                shadowRadius: 25,
                                shadowColor: style.colors.red,
                            },
                        ]}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate("imgFull", {
                                    uri: group.imgUri,
                                })
                            }
                            style={[
                                style.allCenter,
                                styles.imgContainer,
                                style.oHidden,
                            ]}>
                            <Image
                                source={{
                                    uri: group.imgUri,
                                }}
                                style={[style.container, style.allMax]}
                                resizeMode="cover"
                            />
                        </Pressable>
                    </View>

                    {/* Name */}
                    <View style={styles.nameContainer}>
                        <Text style={[style.tWhite, style.Ttitle2]}>
                            {group.name}
                        </Text>
                    </View>

                    {/* Description */}
                    <View style={styles.textContainer}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {group.description}
                        </Text>
                    </View>
                </View>

                {/* Follow Btn */}
                <View style={styles.followButton}>
                    <JoinButton checked={joined} onPress={join} />
                </View>

                {/* Stats Container */}
                <View style={styles.sectionContainer}>
                    <View style={styles.statsContainer}>
                        {/* Members */}
                        <Pressable
                            onPress={() =>
                                navigation.push("userList", {
                                    users: group.members,
                                    title: getLangs("grouppage_members"),
                                    needData: true,
                                })
                            }
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {group.members ? group.members.length : "0"}
                            </Text>
                            <Text
                                style={[
                                    style.tRed,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("grouppage_members")}
                            </Text>
                        </Pressable>

                        {/* Posts */}
                        <View
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {group.posts ? group.posts.length : "0"}
                            </Text>
                            <Text
                                style={[
                                    style.tRed,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("grouppage_posts")}
                            </Text>
                        </View>

                        {/* Events */}
                        <View
                            style={[
                                style.allCenter,
                                styles.statElementContainer,
                            ]}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {group.events ? group.events.length : "0"}
                            </Text>
                            <Text
                                style={[
                                    style.tRed,
                                    style.TsmRg,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("grouppage_events")}
                            </Text>
                        </View>
                    </View>
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
        borderRadius: 25,
        aspectRatio: 1,
    },
    nameContainer: {
        flexDirection: "row",
        marginTop: style.defaultMmd,
        ...style.allCenter,
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
});
