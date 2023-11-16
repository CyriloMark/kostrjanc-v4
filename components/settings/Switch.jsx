import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import * as s from "../../styles";

import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue,
} from "react-native-reanimated";

import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { lerp } from "../../constants";

const BASE_DIAMETER = 32;
const BASE_PADDING = 2;

export default function Switch({ style, onToggle, active }) {
    const [act, setAct] = useState(false);

    //#region Animations
    const offset = useSharedValue(0);
    const bgColor = useSharedValue(s.colors.red);

    const translateStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: offset.value,
                },
            ],
            backgroundColor: bgColor.value,
        };
    });

    useEffect(() => {
        if (!active) {
            offset.value = withSpring(0, {
                stiffness: 90,
                damping: 15,
            });
            bgColor.value = withTiming(s.colors.red);
        } else {
            offset.value = withSpring(BASE_DIAMETER * 0.75, {
                stiffness: 90,
                damping: 15,
            });
            bgColor.value = withTiming(s.colors.blue);
        }
    });
    //#endregion

    return (
        <View style={style}>
            <Pressable
                style={[styles.container, s.border, s.oHidden]}
                onPress={onToggle}>
                <Animated.View
                    style={[
                        styles.elementContainer,
                        s.allCenter,
                        s.oHidden,
                        translateStyle,
                    ]}>
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
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: BASE_DIAMETER * 1.75 + BASE_PADDING * 2, // Base Width of Element * 2 (2 States) + Padding Left/Right
        height: BASE_DIAMETER + BASE_PADDING * 2, // Base Height of Element + Padding Top/Bottom
        borderRadius: 25,
        borderColor: s.colors.white,
        padding: BASE_PADDING - 1,
        zIndex: 3,
    },
    elementContainer: {
        width: BASE_DIAMETER,
        aspectRatio: 1,
        borderRadius: 100,
        zIndex: 2,
    },
});
