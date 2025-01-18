import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Ban from "../../assets/svg/Ban";

export default function Ban() {
    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <View style={[style.container, styles.container]}>
                {/* kostrjanc logo + title */}
                <View style={[styles.layer, { flex: 2 }]}>
                    <Image
                        source={require("../../assets/icons/icon.png")}
                        alt="kostrjanc Logo"
                        resizeMethod="auto"
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text
                        style={[
                            style.TlgBd,
                            style.tBlue,
                            { marginTop: style.defaultMsm },
                        ]}>
                        kostrjanc
                    </Text>
                    <Text
                        style={[
                            style.TsmLt,
                            style.tBlue,
                            { marginTop: style.defaultMsm },
                        ]}>
                        1. serbski social media
                    </Text>
                </View>

                <View style={[styles.layer, { flex: 3 }]}>
                    {/* Ban Icon */}
                    <View
                        style={[
                            styles.iconContainer,
                            style.bgBlue,
                            style.allCenter,
                            style.Plg,
                        ]}>
                        <SVG_Ban
                            style={styles.icon}
                            fill={style.colors.black}
                        />
                    </View>

                    <Text
                        style={[
                            style.TlgRg,
                            style.tCenter,
                            style.tWhite,
                            { marginTop: style.defaultMlg },
                        ]}>
                        {getLangs("ban_title")}
                    </Text>
                    <Text
                        style={[
                            style.TsmRg,
                            style.tWhite,
                            style.tCenter,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("ban_sub_0")}
                        {"\n"}
                        {getLangs("ban_sub_1")}
                    </Text>
                </View>

                {/* Footer */}
                <View style={[styles.layer, { flex: 1 }]}>
                    <Text style={[style.tWhite, style.TsmLt, style.tCenter]}>
                        Version {require("../../app.json").expo.version}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2022-2025
                        All Rights Reserved
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // justifyContent: "space-evenly",
        flexDirection: "column",
    },
    layer: {
        width: "100%",
        ...style.allCenter,
        ...style.pH,
    },
    logo: {
        width: "50%",
        maxHeight: 72,
        maxWidth: 72,
    },

    iconContainer: {
        // width: "40%",
        aspectRatio: 1,
        borderRadius: 100,
    },
    icon: {
        maxHeight: 72,
        maxWidth: 72,
    },
});
