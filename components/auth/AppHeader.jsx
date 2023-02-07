import React from "react";
import { View, StyleSheet, Text } from "react-native";

import * as style from "../../styles";

import SVG_kostrjanc from "../../assets/svg/kostrjanc";

import { LinearGradient } from "expo-linear-gradient";

export default function AppHeader() {
    return (
        <LinearGradient
            colors={[style.colors.black, "transparent"]}
            style={[styles.container, style.Pmd, style.allCenter]}>
            <View
                style={[
                    styles.titleContainer,
                    style.allCenter,
                    style.boxShadow,
                ]}>
                <SVG_kostrjanc fill={style.colors.blue} style={styles.icon} />
                <Text style={[style.TlgBd, style.tWhite]}>kostrjanc</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 58,
    },
    titleContainer: {
        flexDirection: "row",
        width: "100%",
    },
    icon: {
        maxHeight: 32,
        maxWidth: 32,
        aspectRatio: 1,
        flex: 0.1,
        marginRight: style.defaultMmd,
    },
});
