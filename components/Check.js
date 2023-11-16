import React from "react";
import { View, StyleSheet, Pressable, Vibration } from "react-native";

import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

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
                        onPress={onPress}>
                        <Svg style={s.allMax} viewBox="0 0 100 100">
                            <Defs>
                                <RadialGradient
                                    id="grad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%">
                                    <Stop
                                        offset="100%"
                                        stopColor={s.colors.black}
                                        stopOpacity=".25"
                                    />
                                    <Stop
                                        offset="0%"
                                        stopColor={"transparent"}
                                        stopOpacity="0"
                                    />
                                </RadialGradient>
                            </Defs>
                            <Circle r={50} x={50} y={50} fill="url(#grad)" />
                        </Svg>
                    </Pressable>
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
