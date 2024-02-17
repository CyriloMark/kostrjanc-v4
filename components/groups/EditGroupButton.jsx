import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import SVG_Pencil from "../../assets/svg/Pencil";

import Animated, {
    useSharedValue,
    withTiming,
    Easing,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";

export default function EditGroupButton({ checked, title, style, onPress }) {
    const bgOpacity = useSharedValue(1);
    const scale = useSharedValue(0.8);

    const bgAnimationStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(bgOpacity.value, {
                duration: 250,
                easing: Easing.ease,
            }),
        };
    });
    const scaleAnimationStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: withSpring(scale.value, {
                        damping: 25,
                        stiffness: 90,
                    }),
                },
            ],
        };
    });

    useEffect(() => {
        bgOpacity.value = checked ? 1 : 0.5;
        scale.value = checked ? 1 : 0.8;
    }, [checked]);

    return (
        <Animated.View style={scaleAnimationStyles}>
            <View style={[style, s.shadowSec, { borderRadius: 25 }]}>
                <Animated.View
                    style={[styles.container, s.oHidden, bgAnimationStyles]}>
                    <Pressable onPress={checked ? onPress : null}>
                        <LinearGradient
                            style={[s.Pmd, styles.inner]}
                            colors={[s.colors.blue, s.colors.sec]}
                            end={{ x: -0.5, y: 0.5 }}
                            locations={[0, 0.75]}>
                            <View>
                                <SVG_Pencil
                                    style={[
                                        s.boxShadow,
                                        s.oVisible,
                                        styles.icon,
                                    ]}
                                    fill={s.colors.white}
                                />
                            </View>
                            <Text
                                style={[
                                    s.tWhite,
                                    s.Tmd,
                                    { marginLeft: s.defaultMmd },
                                ]}>
                                {title}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        // maxWidth: Dimensions.get("screen").width / 2,
        maxWidth: "100%",
        borderRadius: 25,
    },
    inner: {
        flexDirection: "row",
        ...s.allCenter,
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
