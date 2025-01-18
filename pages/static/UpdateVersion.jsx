import React, { useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    Text,
    Platform,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";

import * as style from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Return from "../../assets/svg/Return";
import SVG_Download from "../../assets/svg/Download";

import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
} from "react-native-reanimated";
import { openLink } from "../../constants";

export default function UpdateVersion({ bottom }) {
    const [closed, setClosed] = useState();

    const getStore = () => {
        return Platform.OS == "android"
            ? "Play Store"
            : Platform.OS == "ios"
            ? "App Store"
            : "";
    };

    const getDownload = () => {
        let link;
        switch (Platform.OS) {
            case "android":
                link =
                    "https://play.google.com/store/apps/details?id=de.kostrjanc.kostrjanc";
                break;
            case "ios":
                link = "https://apps.apple.com/us/app/kostrjanc/id6463418677";
                break;
            default:
                link =
                    "https://play.google.com/store/apps/details?id=de.kostrjanc.kostrjanc";
                break;
        }
        openLink(link);
    };

    const toggle = () => {
        if (!closed) setClosed(true);
        else getDownload();
    };

    return (
        <View style={[style.Pmd, styles.container, { bottom: bottom }]}>
            <Animated.View>
                <LinearGradient
                    colors={[style.colors.red, style.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
                    locations={[0, 0.75]}
                    style={[
                        style.container,
                        style.Pmd,
                        style.bgRed,
                        styles.innerContainer,
                    ]}>
                    <View style={styles.headerContainer}>
                        {/* Title */}
                        <View style={{ flex: 0.75 }}>
                            <Text style={[style.TlgBd, style.tBlack]}>
                                Nowa wersija w {getStore()}.
                            </Text>
                        </View>

                        <Pressable
                            onPress={toggle}
                            style={[
                                styles.headerButtonContainer,
                                style.allCenter,
                            ]}>
                            {!closed ? (
                                <SVG_Return
                                    style={[
                                        styles.headerButtonIcon,
                                        style.allMax,
                                    ]}
                                    fill={style.colors.black}
                                    rotation="90"
                                />
                            ) : (
                                <SVG_Download
                                    style={[
                                        styles.headerButtonIcon,
                                        style.allMax,
                                    ]}
                                    fill={style.colors.black}
                                    rotation="90"
                                />
                            )}
                        </Pressable>
                    </View>
                    {/* Sub */}
                    {!closed ? (
                        <Text
                            style={[
                                style.tBlack,
                                style.TsmRg,
                                { marginTop: style.defaultMsm },
                            ]}>
                            Njejsy na najnowšim stawje aplikacije. Instaluj sej
                            nowu weriju kostrjanc w {getStore()}.
                        </Text>
                    ) : null}

                    {/* Install */}
                    {!closed ? (
                        <View
                            style={[
                                styles.installContainer,
                                { marginTop: style.defaultMmd },
                            ]}>
                            <Text
                                style={[
                                    style.tBlack,
                                    style.Tmd,
                                    { fontFamily: "Barlow_Bold" },
                                ]}>
                                Instalować:
                            </Text>
                            <Pressable
                                onPress={getDownload}
                                style={[
                                    { marginLeft: style.defaultMsm, flex: 1 },
                                    styles.installBtn,
                                ]}>
                                <SVG_Download
                                    style={[style.allMax]}
                                    fill={style.colors.black}
                                    rotation="90"
                                />
                            </Pressable>
                        </View>
                    ) : null}
                </LinearGradient>
            </Animated.View>
        </View>
    );

    // Update Version Page
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
                        Version {props.versions.server}
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
        position: "absolute",
        width: "100%",
        zIndex: 11,
        alignItems: "center",
        overflow: "visible",
        // shadowColor: style.colors.red,
        // shadowOffset: {
        //     height: 0,
        //     width: 0,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 25,
    },
    innerContainer: {
        width: "90%",
        borderRadius: 10,
    },
    headerContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    headerButtonContainer: {
        flex: 0.25,
        // maxWidth: 32,
        // maxHeight: 32,
        borderRadius: 100,
        aspectRatio: 1,
    },
    headerButtonIcon: {
        maxWidth: 32,
        maxHeight: 32,
    },

    installContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 32,
    },
    installBtn: {
        maxWidth: 24,
        maxHeight: 24,
    },
});
const styles2 = StyleSheet.create({
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
