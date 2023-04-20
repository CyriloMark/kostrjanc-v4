import React, { useState, useEffect } from "react";
import { Pressable, View, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import SVG_Return from "../../assets/svg/Return";

export default function EnterButton({ checked, style, onPress }) {
    const bgOpacity = useSharedValue(0);

    const bgAnimationStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(bgOpacity.value, {
                duration: 250,
                easing: Easing.ease,
            }),
        };
    });

    useEffect(() => {
        bgOpacity.value = checked ? 1 : 0.5;
    }, [checked]);

    return (
        <View style={style}>
            <Animated.View
                accessibilityLabel={"Pokročować"}
                style={[styles.container, s.oHidden, bgAnimationStyles]}>
                <Pressable onPress={onPress}>
                    <LinearGradient
                        style={s.allMax}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <View style={[s.Plg, s.allCenter, s.allMax]}>
                            <SVG_Return
                                style={[s.boxShadow, s.oVisible]}
                                fill={s.colors.white}
                            />
                        </View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 102,
        height: 102,
        aspectRatio: 1,
        borderRadius: 25,
    },
    bg: {
        position: "absolute",
    },
});
