import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Platform,
} from "react-native";

import * as style from "../../styles";

import { getDatabase, ref, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

import { getLangs } from "../../constants/langs";
import { arraySplitter } from "../../constants";
import { wait } from "../../constants/wait";

import BackHeader from "../../components/BackHeader";
import EnterButton from "../../components/auth/EnterButton";
import GroupElement from "../../components/cards/GroupElement";
import Refresh from "../../components/RefreshControl";
import ViewGroupButton from "../../components/groups/ViewGroupButton";

const STATIC_GROUPS = [0, 2];

let CLIENT_GROUPS = null;
export default function GroupSelect({ navigation, route, openTTS }) {
    const scrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        getClientGroups();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { activeGroup } = route.params;

    const [groups, setGroups] = useState(STATIC_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState(activeGroup);
    const [groupViewable, setGroupViewable] = useState(false);

    const getClientGroups = async () => {
        get(
            child(
                ref(getDatabase()),
                `users/${getAuth().currentUser.uid}/groups`
            )
        ).then(groupsSnap => {
            if (groupsSnap.exists()) {
                CLIENT_GROUPS = [...STATIC_GROUPS, ...groupsSnap.val()];
                setGroups([...STATIC_GROUPS, ...groupsSnap.val()]);
            }
        });
    };

    //#region Edit Group
    const checkIfGroupIsEditable = () => {
        if (STATIC_GROUPS.includes(selectedGroup.id)) setGroupViewable(false);
        else setGroupViewable(true);
    };

    useEffect(() => {
        checkIfGroupIsEditable();
    }, [selectedGroup]);
    //#endregion

    useEffect(() => {
        if (!CLIENT_GROUPS) getClientGroups();
        else setGroups(CLIENT_GROUPS);
    }, []);

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
                {/* Title */}
                <View>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs("groupselect_title")}
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("groupselect_sub")}
                    </Text>
                </View>

                {/* Groups */}
                <View style={[styles.sectionContainer, styles.groupsContainer]}>
                    {arraySplitter(groups, 2).map((groupLine, line) => (
                        <View key={line} style={styles.groupsSelectLine}>
                            {groupLine.map((group, key) =>
                                group != null ? (
                                    <GroupElement
                                        key={key}
                                        groupId={group}
                                        longPress={data =>
                                            navigation.navigate({
                                                name: "landing",
                                                params: {
                                                    group: {
                                                        id: group,
                                                        groupData: data,
                                                    },
                                                },
                                                merge: true,
                                            })
                                        }
                                        press={data =>
                                            setSelectedGroup({
                                                groupData: data,
                                                id: group,
                                            })
                                        }
                                        active={
                                            selectedGroup.id == group
                                                ? true
                                                : false
                                        }
                                        style={[
                                            styles.groupsItem,
                                            style.shadowSecSmall,
                                            selectedGroup.id == group
                                                ? {
                                                      borderColor:
                                                          style.colors.red,
                                                      ...style.border,
                                                  }
                                                : null,
                                        ]}
                                    />
                                ) : (
                                    <View style={styles.groupsItem} key={key} />
                                )
                            )}
                        </View>
                    ))}
                </View>

                <View style={styles.editButton}>
                    <ViewGroupButton
                        checked={groupViewable}
                        onPress={() =>
                            navigation.navigate("groupView", {
                                groupId: selectedGroup.id,
                            })
                        }
                    />
                </View>

                {/* Button */}
                <View style={[style.allCenter, styles.sectionContainer]}>
                    <EnterButton
                        onPress={() =>
                            navigation.navigate({
                                name: "landing",
                                params: {
                                    group: selectedGroup,
                                },
                                merge: true,
                            })
                        }
                        checked={true}
                    />
                </View>

                <View style={styles.sectionContainer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    groupsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        flexBasis: "auto",
    },
    groupsSelectLine: {
        width: "100%",
        flexDirection: "row",
    },
    groupsItem: {
        margin: style.defaultMsm,
        flex: 1,
        borderRadius: 10,
    },

    editButton: {
        marginTop: style.defaultMlg,
        alignSelf: "center",
    },
});
