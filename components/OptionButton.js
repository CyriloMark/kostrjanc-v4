import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import * as s from "../styles";

import SVG_Return from "../assets/svg/Return";

export default function OptionButton({ style, onPress, title, red, icon }) {
    if (!red) {
        return (
            <View style={style}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <View style={[s.Pmd, s.allCenter, styles.inner]}>
                        <SVG_Return
                            fill={s.colors.white}
                            rotation={0}
                            style={styles.btn}
                        />
                        <View style={[styles.text, s.oHidden]}>
                            <View style={styles.icon}>{icon}</View>
                            <Text
                                style={[s.tWhite, s.Tmd]}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {title}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    } else {
        return (
            <View style={style}>
                <Pressable
                    style={[
                        styles.container,
                        s.oHidden,
                        s.border,
                        { borderColor: s.colors.red, borderRadius: 10 },
                    ]}
                    onPress={onPress}>
                    <View style={[s.Pmd, s.allCenter, styles.inner]}>
                        <SVG_Return
                            fill={s.colors.red}
                            rotation={0}
                            style={styles.btn}
                        />
                        <View style={[styles.text, s.oHidden]}>
                            <View style={styles.icon}>{icon}</View>
                            <Text
                                style={[s.tRed, s.Tmd]}
                                ellipsizeMode="tail"
                                numberOfLines={1}>
                                {title}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        width: "100%",
    },
    inner: {
        flexDirection: "row-reverse",
        justifyContent: "center",
    },

    btn: {
        flex: 1,
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },

    text: {
        flex: 1,
        marginRight: s.defaultMmd,
        flexDirection: "row",
    },
    icon: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: s.defaultMlg,
    },
});
