import React, { useEffect } from "react";

import { View, Pressable, Text, StyleSheet } from "react-native";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import { Heart } from "../../assets/svg/Heart";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolateColor,
    withTiming,
    Easing,
} from "react-native-reanimated";

const AnimatedHeartSVG = Animated.createAnimatedComponent(Heart);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function LikeButton({ style, onPress, liked }) {
    const heartScale = useSharedValue(1);
    const gradientScale = useSharedValue(1);

    const heartStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: heartScale.value,
                },
            ],
        };
    });

    const gradientStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: gradientScale.value,
                },
            ],
        };
    });

    useEffect(() => {
        heartScale.value = withSpring(liked ? 1.5 : 1, {
            damping: 10,
            stiffness: 80,
        });
        gradientScale.value = withSpring(liked ? 0 : 1, {
            damping: 10,
            stiffness: 80,
        });
    }, [liked]);

    return (
        <View style={style}>
            <Pressable
                style={[styles.container, s.allCenter, s.oHidden]}
                onPress={onPress}>
                <AnimatedLinearGradient
                    style={[s.allMax, { position: "absolute" }, gradientStyles]}
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
                    locations={[0, 0.75]}
                />

                <AnimatedHeartSVG
                    style={[styles.icon, heartStyles]}
                    fill={liked ? s.colors.red : s.colors.black}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 42,
        height: 42,
        borderRadius: 100,
        aspectRatio: 1,
    },
    icon: {
        position: "relative",
        aspectRatio: 1,
        width: 24,
        height: 24,
    },
});
