import React, { useEffect } from "react";
import { View, StyleSheet, Text, Pressable, Dimensions } from "react-native";

import * as style from "../../styles";

import AppHeader from "../../components/auth/AppHeader";

import { getLangs } from "../../constants/langs";

import SVG_Login from "../../assets/svg/Logout";

export default function Landing({ navigation }) {
    return (
        <View style={[style.container, style.bgBlack]}>
            <AppHeader />

            <View
                style={[
                    style.container,
                    style.pH,
                    styles.container,
                    style.oVisible,
                ]}>
                <View style={styles.titleContainer}>
                    <Text style={[style.Ttitle, style.tWhite]}>
                        {getLangs("auth_landing_welcome_title")}
                    </Text>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text style={[style.Ttitle, style.tBlue]}>
                            kostrjanc
                        </Text>
                        <Text style={[style.Ttitle, style.tWhite]}>!</Text>
                    </View>
                </View>

                <View style={[styles.subContainer, style.pH]}>
                    <Text style={[style.tWhite, style.Tmd]}>
                        {getLangs("auth_landing_sub_0")}
                        {"\n"}
                        {getLangs("auth_landing_sub_1")}
                        {"\n"}
                        {getLangs("auth_landing_sub_2")}
                    </Text>
                </View>

                <Text
                    style={[
                        style.tWhite,
                        style.TlgBd,
                        { width: "100%", marginTop: style.defaultMlg },
                    ]}>
                    {getLangs("auth_landing_begin")}
                </Text>

                {/* Auth */}
                <View
                    style={[
                        styles.authContainer,
                        style.allCenter,
                        { zIndex: 5 },
                    ]}>
                    {/* Login */}
                    <View style={[styles.sideBox, style.allCenter]}>
                        <Pressable
                            onPress={() => navigation.navigate("login")}
                            style={[
                                styles.sideBoxInner,
                                style.Plg,
                                style.border,
                            ]}>
                            <View style={styles.sideBoxIconContainer}>
                                <SVG_Login
                                    fill={style.colors.red}
                                    style={[style.allMax, styles.sideBoxIcon]}
                                />
                            </View>
                            <Text style={[style.tRed, style.TlgRg]}>
                                {getLangs("auth_landing_login")}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Register */}
                    <Pressable
                        style={{ marginTop: style.defaultMlg }}
                        onPress={() => navigation.navigate("register")}>
                        <Text style={[style.tWhite, style.Tmd, style.tCenter]}>
                            {getLangs("auth_landing_register")}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.footerContainer, style.allCenter]}>
                <Text style={[style.TsmLt, style.tWhite, style.tCenter]}>
                    Version {require("../../app.json").expo.version}
                    {"\n"}
                    Produced by Mark, Cyril; Baier, Korla{"\n"}© 2023 All Rights
                    Reserved
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        marginTop: style.defaultMsm,
        alignItems: "center",
    },

    titleContainer: {
        flexDirection: "column",
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 1,
    },

    subContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 1,
    },

    authContainer: {
        ...style.container,
        top: -style.defaultMmd,
    },

    sideBox: {
        height: 72,
        zIndex: 5,
        ...style.oHidden,
    },
    sideBoxInner: {
        borderColor: style.colors.red,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        zIndex: 5,
    },
    sideBoxIconContainer: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: style.defaultMmd,
        zIndex: 7,
    },
    sideBoxIcon: {
        ...style.allMax,
        transform: [
            {
                scaleX: 1,
            },
        ],
    },

    footerContainer: {
        width: "100%",
        position: "absolute",
        bottom: style.defaultMmd,
    },
});
