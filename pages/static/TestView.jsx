import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

import AppHeader from "../../components/auth/AppHeader";
import EnterButton from "../../components/auth/EnterButton";
import { ScrollView } from "react-native";

const missingFkt = [
    "Voluptate irure mollit occaecat in ut ea ex est quis nulla.",
    "Esse consectetur cillum eiusmod magna et dolor tempor laboris amet aute nisi voluptate.",
    "Duis sint est reprehenderit eiusmod sunt eiusmod adipisicing.",
    "Nisi elit irure consequat sunt voluptate dolor Lorem id enim incididunt non qui incididunt.",
];

export default function TestView(props) {
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
                    Witaj při zawrjenym beta-tesće.
                </Text>
                <Text
                    style={[
                        style.Tmd,
                        style.tWhite,
                        { marginTop: style.defaultMmd },
                    ]}>
                    Sy wuzwoleny za testowanje kostrjanc. My prosymy wo
                    diskretny test a konstruktiwnu kritiku. Při prašenjach abo
                    namjetach prosymy wo powěsć na{" "}
                    <Text
                        style={[
                            style.tBlue,
                            {
                                textDecorationStyle: "solid",
                                textDecorationLine: "underline",
                                textDecorationColor: style.colors.blue,
                            },
                        ]}>
                        info@kostrjanc.de
                    </Text>
                    . Při powěsći přidaj prošu wersiju, z kotrejž dźěłaš.
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
                        Funkcije, kiž faluja:
                    </Text>
                    {missingFkt.map((fkt, key) => (
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
                    Dźakuju za twoju prócu!
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
