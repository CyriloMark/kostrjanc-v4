import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import { convertTimestampToString } from "../../constants/time";
import { getLangs } from "../../constants/langs";

export default function ServerStatus(props) {
    // Get Text Hint - Server State
    let getText = () => {
        if (!props.status) return;
        let output = <></>;
        let input = props.status.split("/");

        switch (input[0]) {
            case "offline":
                output = (
                    <Text
                        style={[
                            style.tWhite,
                            style.TsmRg,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("serverstatus_offline_title")}
                    </Text>
                );
                break;
            // pause/5 hodź./1662901993471
            case "pause":
                output = (
                    <View style={{ marginTop: style.defaultMmd }}>
                        <Text style={[style.tWhite, style.TsmRg]}>
                            {getLangs("serverstatus_pause_title")}
                        </Text>
                        <Text
                            style={[
                                { marginTop: style.defaultMmd },
                                style.Tmd,
                                style.tWhite,
                            ]}>
                            {getLangs("serverstatus_pause_time_0")}{" "}
                            <Text style={[style.tBlue, style.TsmLt]}>
                                {input[1]}
                            </Text>{" "}
                            {getLangs("serverstatus_pause_time_1")}
                            {"\n"}
                            {getLangs("serverstatus_pause_time_2")}{" "}
                            <Text style={[style.tBlue, style.TsmLt]}>
                                {convertTimestampToString(parseInt(input[2]))}
                            </Text>
                        </Text>
                    </View>
                );
                break;
            default:
                break;
        }
        return output;
    };

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
                    <Text style={[style.tWhite, style.TlgRg]}>
                        {getLangs("serverstatus_title")}
                    </Text>
                    {getText()}
                    <Text
                        style={[
                            style.TlgRg,
                            style.tWhite,
                            { marginTop: style.defaultMmd },
                        ]}>
                        {getLangs("serverstatus_sub")}
                    </Text>
                </View>

                <View style={[styles.layer, { flex: 1 }]}>
                    <Text style={[style.tWhite, style.TsmLt, style.tCenter]}>
                        Version {require("../../app.json").expo.version}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2023 All
                        Rights Reserved
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
