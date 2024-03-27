import React, { useEffect } from "react";

import { View, Pressable, Text, StyleSheet } from "react-native";

import * as s from "../../styles";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { LinearGradient } from "expo-linear-gradient";

import { getLangs } from "../../constants/langs";

import SVG_Return from "../../assets/svg/Return";

export default function ShowNewButton({ style, onPress }) {
    const activeVal = useSharedValue(0);

    const scaleStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(activeVal.value, {
                duration: 250,
            }),
            top: withTiming(64 * activeVal.value, {
                duration: 250,
                easing: Easing.bezier(0.05, 0.5, 0.55, 1),
            }),
        };
    });

    const pulsing = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: withRepeat(
                        withSequence(
                            withDelay(
                                2500,
                                withTiming(-2, {
                                    duration: 500,
                                    easing: Easing.ease,
                                })
                            ),
                            withTiming(0, {
                                duration: 500,
                                easing: Easing.ease,
                            })
                        ),
                        -1,
                        false
                    ),
                },
            ],
        };
    });

    useEffect(() => {
        activeVal.value = 1;
    }, []);

    return (
        <Animated.View style={[style, scaleStyles, s.bgBlack, styles.shadow]}>
            <Pressable
                onPress={() => {
                    onPress();
                    activeVal.value = 0;
                }}
                style={styles.container}>
                <LinearGradient
                    style={[s.allCenter, s.Pmd, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <Animated.View style={[styles.icon, pulsing]}>
                        <SVG_Return
                            fill={s.colors.black}
                            style={s.allMax}
                            rotation={270}
                        />
                    </Animated.View>
                    <Text style={[s.tBlack, s.Tmd]}>
                        {getLangs("landing_newcontentbutton")}
                    </Text>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        zIndex: 15,

        shadowColor: s.colors.black,
        shadowOffset: {
            x: 0,
            y: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    container: {
        position: "absolute",
        top: -64,
        marginVertical: s.defaultMlg,
        width: "100%",
        alignItems: "center",
        zIndex: 50,
    },
    inner: {
        flexDirection: "row",
        borderRadius: 25,
    },
    icon: {
        width: 12,
        height: 12,
        marginRight: s.defaultMmd,
    },
});
