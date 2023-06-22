import React from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { getLangs, getCurrentLanguage } from "../../constants/langs";
import { openLink } from "../../constants";

import AppHeader from "../../components/auth/AppHeader";
import EnterButton from "../../components/auth/EnterButton";

const newFktHSB = [
    "Wužiwarjo daja so nětko wot wšitkich sobu zapřijeć!",
    "Komentary bychu dyrbjeli so nětko prawje wozjewić. Jeničce profilne wobrazy po wozjewjenju su hišće problematika.",
    "Moderatory a adminy móža komentary wotstronić, hdyž dołho na tutón tłóča.",
    "Tutorial funkcije - informaciske wokna",
];
const newFktDE = [
    "Nutzer lassen sich nun von jedem verlinken!",
    "Kommentare müssten nun richtig veröffentlicht werden. Lediglich die Profilbilder nach der Veröffentlichung sind noch eine Problematik.",
    "Moderatoren und Admins können Kommentare entfernen, wenn sie lange auf diese drücken.",
    "Tutorial Funktion - Informationsfenster",
];

const missingFktHSB = [
    "Algorytmus hłowneje strony njeje dospowny.",
    "Powěsćowe zastajenja",
    "Rěč: delnoserbšćina",
];
const missingFktDE = [
    "Algorythmus der Hauptseite ist nicht final.",
    "Einstellungen von Benachrichtigungen",
    "Sprache: Niedersorbisch",
];

export default function TestView(props) {
    const getLangCriterias = opt => {
        switch (getCurrentLanguage()) {
            case 0:
                return opt === 0 ? newFktHSB : missingFktHSB;
            case 1:
                return [];
            case 2:
                return opt === 0 ? newFktDE : missingFktDE;
            default:
                break;
        }
    };
    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <AppHeader />
            <ScrollView
                keyboardDismissMode="interactive"
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                style={[style.container, style.pH, style.oVisible]}>
                <Text
                    style={[
                        style.Ttitle2,
                        style.tWhite,
                        { marginTop: style.defaultMsm },
                    ]}>
                    {getLangs("testview_title")}
                </Text>
                <Text
                    style={[
                        style.Tmd,
                        style.tWhite,
                        { marginTop: style.defaultMmd },
                    ]}>
                    {getLangs("testview_sub_0")}
                    <Text
                        style={[
                            style.tBlue,
                            {
                                textDecorationStyle: "solid",
                                textDecorationLine: "underline",
                                textDecorationColor: style.colors.blue,
                            },
                        ]}
                        onPress={() => openLink("mailto:info@kostrjanc.de")}>
                        info@kostrjanc.de
                    </Text>
                    {getLangs("testview_sub_1")}
                </Text>

                <Text
                    style={[
                        style.tCenter,
                        style.Tmd,
                        style.tWhite,
                        { marginTop: style.defaultMlg },
                    ]}>
                    {getLangs("updateversion_currentversion")}{" "}
                    <Text style={style.TsmLt}>
                        {require("../../app.json").expo.version}
                    </Text>
                </Text>

                <View style={{ marginTop: style.defaultMlg }}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("testview_new_title")}
                    </Text>
                    {getLangCriterias(0).map((fkt, key) => (
                        <Text
                            key={key}
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {fkt}
                        </Text>
                    ))}
                </View>
                <View style={{ marginTop: style.defaultMlg }}>
                    <Text style={[style.TlgBd, style.tWhite]}>
                        {getLangs("testview_missing_title")}
                    </Text>
                    {getLangCriterias(1).map((fkt, key) => (
                        <Text
                            key={key}
                            style={[
                                style.Tmd,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {fkt}
                        </Text>
                    ))}
                </View>

                <Text
                    style={[
                        style.tCenter,
                        style.TlgBd,
                        style.tWhite,
                        { marginTop: style.defaultMlg },
                    ]}>
                    {getLangs("testview_thx")}
                </Text>

                <View style={[style.allCenter, styles.button]}>
                    <EnterButton onPress={() => props.onCheck()} checked />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // justifyContent: "space-evenly",
        flexDirection: "column",
    },
    button: {
        marginVertical: style.defaultMlg,
    },
});
