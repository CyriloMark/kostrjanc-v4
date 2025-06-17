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

export default function ActionButton({
    checked,
    style,
    aspect,
    content,
    onPress,
}) {
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
                style={[
                    styles.container,
                    s.oHidden,
                    { aspectRatio: aspect ? aspect : null },
                    bgAnimationStyles,
                ]}>
                <Pressable onPress={checked ? onPress : null}>
                    <LinearGradient
                        // style={s.allMax}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <View style={[s.Psm, s.allCenter, s.allMax]}>
                            {content}
                        </View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        maxHeight: 58,
    },
});
