import React, { useEffect, useState } from "react";
import { View, Pressable, ScrollView, Text, StyleSheet } from "react-native";

import * as style from "../../styles";

import BackHeader from "../../components/BackHeader";

import { getLangs } from "../../constants/langs";
import { create } from "../../constants/content/create";

import {
    Challenge_Group,
    General_Group,
} from "../../constants/content/GroupData";

import ChallengeSubmitButton from "../../components/content/ChallengeSubmitButton";
import GeneralSubmitButton from "../../components/content/GeneralSubmitButton";
import GroupElement from "../../components/content/GroupElement";
import EventElement from "../../components/cards/EventElement";

export default function DestSelect({ navigation }) {
    const [groupsData, setGroupsData] = useState([]);
    const [eventData, setEventData] = useState([]);

    const [canUploadForChallenge, setCanUploadForChallenge] = useState(true);

    useEffect(() => {
        create
            .getGroups()
            .then(groups =>
                create.getGroupsData(groups).then(gD => setGroupsData(gD))
            );
        create.checkForChallenge().then(res => setCanUploadForChallenge(res));

        create.getTopEvents().then(events => {
            create.getEventsData(events).then(eD => setEventData(eD));
        });
    }, []);

    function handlePress(_type, _id, _data) {
        navigation.navigate("postCreate", {
            fromEdit: false,
            editData: null,
            dest: {
                type: _type,
                id: _id,
                data: _data,
            },
        });
    }

    return (
        <View style={[style.container, style.bgBlack]}>
            {
                //#region Page Header
            }
            <Pressable style={{ zIndex: 10 }}>
                <BackHeader title={""} onBack={() => navigation.goBack()} />
            </Pressable>

            <ScrollView
                style={[style.container, style.pH, style.oVisible]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd>
                <View style={styles.titleContainer}>
                    <Text style={[style.Ttitle2, style.tWhite]}>
                        {getLangs("destselect_title")}
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {getLangs("destselect_hint")}
                    </Text>
                </View>

                {
                    //#region General Select Button
                }
                <GeneralSubmitButton
                    style={styles.sectionContainer}
                    onPress={() => {
                        if (canUploadForChallenge)
                            handlePress("g", 0, General_Group);
                    }}
                />

                {
                    //#region Challenge Select Button
                }
                <ChallengeSubmitButton
                    style={styles.sectionContainer}
                    active={canUploadForChallenge}
                    onPress={() => {
                        if (canUploadForChallenge)
                            handlePress("g", 2, Challenge_Group);
                    }}
                />

                {
                    //#region Group Select Section
                }
                {groupsData.length !== 0 ? (
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("destselect_group_title")}
                        </Text>

                        <ScrollView
                            scrollEnabled
                            style={styles.groupSelectContainer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            bounces>
                            {groupsData.map((g, k) => (
                                //#region Group Element Button
                                <GroupElement
                                    style={{ margin: style.defaultMsm }}
                                    group={g}
                                    key={k}
                                    onPress={() => handlePress("g", g.id, g)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                ) : null}

                {
                    //#region Event Select Section
                }
                {eventData.length !== 0 ? (
                    <View
                        style={[
                            styles.sectionContainer,
                            { marginBottom: style.defaultMlg },
                        ]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("destselect_event_title")}
                        </Text>
                        <Text
                            style={[
                                style.Tsm,
                                style.tWhite,
                                { marginVertical: style.defaultMsm },
                            ]}>
                            {getLangs("destselect_event_sub")}
                        </Text>

                        {eventData.map((e, k) => (
                            <EventElement
                                style={{ marginTop: style.defaultMmd }}
                                event={e}
                                key={k}
                                onPress={() => handlePress("e", e.id, e)}
                            />
                        ))}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "column",
        width: "100%",
        zIndex: 1,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    groupSelectContainer: {
        width: "100%",
        marginTop: style.defaultMsm,
    },
});
