import React from "react";
import { Pressable, View, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../styles/index";

import SVG_Share from "../assets/svg/Share";
import SVG_Warn from "../assets/svg/Warn";
import SVG_Ban from "../assets/svg/Ban";

export default function InteractionBar({
    style,
    share,
    warn,
    ban,
    onShare,
    onWarn,
    onBan,
}) {
    return (
        <View style={style}>
            <View style={[s.Psm, styles.container]}>
                {share ? (
                    <SVG_Share style={[styles.icon]} fill={s.colors.sec} />
                ) : null}
                {warn ? (
                    <SVG_Warn
                        style={[styles.icon, { marginLeft: s.defaultMlg }]}
                        fill={s.colors.sec}
                    />
                ) : null}
                {ban ? (
                    <SVG_Ban
                        style={[styles.icon, { marginLeft: s.defaultMlg }]}
                        fill={s.colors.sec}
                    />
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
