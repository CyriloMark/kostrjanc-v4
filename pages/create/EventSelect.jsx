import React, { useEffect, useState } from "react";
import { View, Pressable, ScrollView, Text, StyleSheet } from "react-native";

import * as style from "../../styles";

import BackHeader from "../../components/BackHeader";

import { getLangs } from "../../constants/langs";
import { create } from "../../constants/content/create";

import ChallengeSubmitButton from "../../components/content/ChallengeSubmitButton";
import GeneralSubmitButton from "../../components/content/GeneralSubmitButton";
import GroupElement from "../../components/content/GroupElement";
import EventElement from "../../components/cards/EventElement";

export default function EventSelect({ navigation }) {
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

    function handlePress(opt) {
        navigation.navigate("postCreate", {
            fromLinking: false,
            linkingData: null,
            fromEdit: false,
            editData: null,
            group: opt,
        });
    }

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
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
                        {/* {getLangs("createEventSelect_title")} */}
                        Cil posta wuzwolić
                    </Text>

                    <Text
                        style={[
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {/* {getLangs("createEventSelect_hint")} */}
                        Wuzwol sej prawu skupinu abo ewent, hdźeš chceš nowy
                        post wozjewić.
                    </Text>
                </View>

                {/* General Select */}
                <GeneralSubmitButton
                    style={styles.sectionContainer}
                    onPress={() => {
                        if (canUploadForChallenge) handlePress(0);
                    }}
                />

                {/* Challenge Select */}
                <ChallengeSubmitButton
                    style={styles.sectionContainer}
                    active={canUploadForChallenge}
                    onPress={() => {
                        if (canUploadForChallenge) handlePress(2);
                    }}
                />

                {/* Group Select */}
                {groupsData.length !== 0 ? (
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Do skupiny dźělić
                        </Text>

                        <ScrollView
                            scrollEnabled
                            style={styles.groupSelectContainer}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            bounces>
                            {groupsData.map((g, k) => (
                                <GroupElement
                                    style={{ margin: style.defaultMsm }}
                                    group={g}
                                    key={k}
                                    onPress={() => handlePress(g.id)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                ) : null}

                {/* Event Select */}
                {eventData.length !== 0 ? (
                    <View
                        style={[
                            styles.sectionContainer,
                            { marginBottom: style.defaultMlg },
                        ]}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Za ewent dźělić
                        </Text>
                        <Text
                            style={[
                                style.Tsm,
                                style.tWhite,
                                { marginVertical: style.defaultMsm },
                            ]}>
                            {/* {getLangs("createEventSelect_hint")} */}
                            Maš wobraz, kiž sy na aktualnym ewenće nahrałał? Tak
                            postuj tutón na kostrjancu a zhromadźuj kostrjancy.
                        </Text>

                        {eventData.map((e, k) => (
                            <EventElement
                                style={{ marginTop: style.defaultMmd }}
                                event={e}
                                key={k}
                                onPress={() => handlePress()}
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
