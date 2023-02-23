import React from "react";

import { View, StyleSheet, Text, Image, Pressable } from "react-native";

import * as style from "../../styles";

import SVG_Settings from "../../assets/svg/Settings";
import SVG_Return from "../../assets/svg/Return";

import { LinearGradient } from "expo-linear-gradient";

export default function ContentHeader(props) {
    return (
        <LinearGradient
            colors={[style.colors.black, "transparent"]}
            style={[
                styles.container,
                style.Pmd,
                style.allCenter,
                { zIndex: 10 },
            ]}>
            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onSettingsPress}>
                <SVG_Settings fill={style.colors.blue} />
            </Pressable>

            <View
                style={[
                    styles.titleContainer,
                    style.allCenter,
                    style.boxShadow,
                ]}>
                <Text style={[style.TlgBd, style.tWhite]}>kostrjanc</Text>
                <View
                    style={[
                        style.allCenter,
                        styles.shBox,
                        style.bgBlue,
                        style.Psm,
                    ]}>
                    <Text style={[style.TsmRg, style.tWhite, styles.shText]}>
                        studio
                    </Text>
                </View>
            </View>

            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onBack}>
                <SVG_Return fill={style.colors.blue} rotation={0} />
            </Pressable>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 58,
        flexDirection: "row",
    },

    btnContainer: {
        flex: 0.1,
        // backgroundColor: "red",
        height: "100%",
    },

    titleContainer: {
        flexDirection: "row",
        flex: 0.8,
    },
    shBox: {
        borderRadius: 10,
        marginLeft: style.defaultMmd,
    },
    shText: {
        textTransform: "uppercase",
    },

    pbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
        overflow: "hidden",
    },
    pb: {
        width: "100%",
        height: "100%",
    },
});
