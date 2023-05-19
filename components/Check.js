import React from "react";
import { View, StyleSheet, Pressable, Vibration } from "react-native";

import * as s from "../styles";

/**
 *
 * @param {color} color 0: prime: blue, sec: sec; 1: prime: white, sec: red
 * @returns
 */
export default function Check({ checked, style, onPress, color }) {
    return (
        <View style={style}>
            <Pressable
                style={[
                    styles.container,
                    s.border,
                    {
                        borderColor: color ? s.colors.blue : s.colors.red,
                    },
                ]}
                onPress={onPress}>
                {checked ? (
                    <Pressable
                        style={[styles.inner, color ? s.bgBlue : s.bgWhite]}
                        onPress={onPress}
                    />
                ) : (
                    <Pressable style={s.allMax} onPress={onPress} />
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        padding: s.Psm.paddingVertical,
    },
    inner: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 100,
    },
});
