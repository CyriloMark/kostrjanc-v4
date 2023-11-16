import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import * as s from "../../styles";

import SVG_Warn from "../../assets/svg/Warn";

export default function WarnButton({ style, text, sub, onPress }) {
    return (
        <View style={style}>
            <Pressable
                style={[s.border, s.Pmd, s.allCenter, styles.container]}
                onPress={onPress}>
                <View style={styles.signContainer}>
                    <SVG_Warn old style={[styles.pin]} fill={s.colors.red} />
                </View>
                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[s.TlgRg, s.tRed]}>{text}</Text>
                    <Text
                        style={[s.TsmRg, s.tRed, { marginTop: s.defaultMsm }]}>
                        {sub}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: s.defaultMmd * 2,
        borderColor: s.colors.red,
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
    },
    signContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 12,
        maxWidth: 12,
    },

    textContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
        flexDirection: "column",
    },
});
