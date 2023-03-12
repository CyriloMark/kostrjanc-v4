import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

export default function UpdateVersion(props) {
    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <View style={[style.container, styles.container]}>
                <View style={[styles.layer, { flex: 3 }]}>
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

                <View style={[styles.layer, { flex: 2 }]}>
                    <Text style={[style.tWhite, style.TsmRg, style.tCenter]}>
                        {getLangs("updateversion_title")}
                        {"\n"}
                        {getLangs("updateversion_sub")}{" "}
                        {Platform.OS === "ios" ? "App Store" : "Play Store"}.
                    </Text>

                    <Text
                        style={[
                            style.tCenter,
                            style.Tmd,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("updateversion_clientversion")}{" "}
                        <Text style={style.TsmLt}>{props.versions.client}</Text>
                        {"\n"}
                        {getLangs("updateversion_currentversion")}{" "}
                        <Text style={style.TsmLt}>{props.versions.server}</Text>
                    </Text>
                </View>

                {/* Footer */}
                <View style={[styles.layer, { flex: 1 }]}>
                    <Text style={[style.tWhite, style.TsmLt, style.tCenter]}>
                        wersija {props.versions.server}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2023 all
                        rights reserved
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
});
