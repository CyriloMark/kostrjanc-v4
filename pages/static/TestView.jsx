import React from "react";
import { View, Image, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { getLangs, getCurrentLanguage } from "../../constants/langs";
import { openLink } from "../../constants";

import AppHeader from "../../components/auth/AppHeader";
import EnterButton from "../../components/auth/EnterButton";

const missingFktHSB = [
    "Zmylk w fukciji kartow → karty su hasnjene",
    "Algorytmus hłowneje strony njeje dospowny",
    "Powěsćowe zastajenja",
    "Rěč: delnoserbšćina",
];
const missingFktDE = [
    "Fehler bei den Karten → Karten sind nicht vefügbar",
    "Algorythmus der Hauptseite ist nicht final",
    "Einstellungen von Benachrichtigungen",
    "Sprache: Niedersorbisch",
];

export default function TestView(props) {
    const getLangCriterias = () => {
        switch (getCurrentLanguage()) {
            case 0:
                return missingFktHSB;
            case 1:
                return [];
            case 2:
                return missingFktDE;
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
                        {getLangs("testview_missing_title")}
                    </Text>
                    {getLangCriterias().map((fkt, key) => (
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
        marginTop: style.defaultMlg,
    },
});
