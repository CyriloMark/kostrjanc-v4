import React from "react";
import { Pressable, View, StyleSheet } from "react-native";

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
                    <Pressable onPress={onShare} style={styles.iconContainer}>
                        <SVG_Share style={styles.icon} fill={s.colors.blue} />
                    </Pressable>
                ) : null}
                {warn ? (
                    <Pressable
                        onPress={onWarn}
                        style={[
                            styles.iconContainer,
                            { marginLeft: s.defaultMlg },
                        ]}>
                        <SVG_Warn style={styles.icon} fill={s.colors.blue} />
                    </Pressable>
                ) : null}
                {ban ? (
                    <Pressable
                        onPress={onBan}
                        style={[
                            styles.iconContainer,
                            { marginLeft: s.defaultMlg },
                        ]}>
                        <SVG_Ban style={styles.icon} fill={s.colors.blue} />
                    </Pressable>
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
    iconContainer: {
        maxWidth: 24,
        maxHeight: 24,
    },
    icon: {
        aspectRatio: 1,
        width: "100%",
    },
});
