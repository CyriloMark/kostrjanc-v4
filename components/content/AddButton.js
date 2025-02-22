import React, { useState, useEffect } from "react";
import { Pressable, View, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    Easing,
    withRepeat,
    withDelay,
    withSequence,
} from "react-native-reanimated";

import SVG_Add from "../../assets/svg/Add";

export default function AddButton({ checked, style, onPress }) {
    //#region Add Button Animation of old way
    const startBoxWidth = useSharedValue(72);
    const startIconRotation = useSharedValue(0);
    const bgOpacity = useSharedValue(0);

    const startBoxStyles = useAnimatedStyle(() => {
        return {
            width: withSpring(startBoxWidth.value, {
                damping: 10,
                stiffness: 90,
            }),
        };
    });

    const rotationAnimation = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${startIconRotation.value}deg`,
                },
            ],
        };
    });

    const bgAnimationStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(bgOpacity.value, {
                duration: 250,
                easing: Easing.ease,
            }),
        };
    });

    useEffect(() => {
        startBoxWidth.value = !checked ? 72 : 58;
        startIconRotation.value = withTiming(!checked ? 0 : 45, {
            duration: 250,
            easing: Easing.ease,
        });
        bgOpacity.value = checked ? 1 : 0;
    }, [checked]);
    //#endregion

    //#region Pulse Animation
    const maxScale = 1.05;
    const minScale = 1.0;
    const pulseStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withRepeat(
                        withSequence(
                            withTiming(minScale, {
                                duration: 10,
                                easing: Easing.ease,
                            }),
                            withDelay(
                                5000,
                                withSpring(maxScale, {
                                    damping: 90,
                                    stiffness: 50,
                                })
                            ),
                            withSpring(minScale, {
                                damping: 90,
                                stiffness: 50,
                            })
                        ),
                        0,
                        true
                    ),
                },
            ],
        };
    });
    //#endregion

    return (
        <View style={[style, styles.shadow, s.bgBlack]}>
            <Animated.View
                style={[
                    styles.container,
                    s.oHidden,
                    startBoxStyles,
                    pulseStyles,
                ]}>
                <Pressable onPress={onPress}>
                    <LinearGradient
                        style={s.allMax}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <Animated.View
                            style={[styles.bg, s.allMax, bgAnimationStyles]}>
                            <Pressable onPress={onPress} style={s.allMax}>
                                <LinearGradient
                                    style={s.allMax}
                                    colors={[s.colors.red, s.colors.white]}
                                    end={{ x: 0.5, y: 2.5 }}
                                    locations={[0, 0.75]}
                                />
                            </Pressable>
                        </Animated.View>

                        <View style={[s.allCenter, s.allMax]}>
                            <Animated.View
                                style={[
                                    s.allMax,
                                    s.Plg,
                                    s.allCenter,
                                    rotationAnimation,
                                ]}>
                                <SVG_Add
                                    style={[s.boxShadow, s.oVisible]}
                                    fill={s.colors.white}
                                />
                            </Animated.View>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 72,
        maxHeight: 72,
        aspectRatio: 1,
        borderRadius: 25,
    },
    bg: {
        position: "absolute",
    },
    shadow: {
        shadowColor: s.colors.blue,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.33,
        shadowRadius: 25,
        borderRadius: 25,
    },
});
