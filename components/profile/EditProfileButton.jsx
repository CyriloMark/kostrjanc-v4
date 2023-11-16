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
} from "react-native-reanimated";

export default function EditProfileButton({ checked, title, style, onPress }) {
    const bgOpacity = useSharedValue(1);

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
        <View style={[style, s.shadowSec, { borderRadius: 25 }]}>
            <Animated.View
                style={[styles.container, s.oHidden, bgAnimationStyles]}>
                <Pressable onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, styles.inner]}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <View>
                            <SVG_Pencil
                                style={[s.boxShadow, s.oVisible, styles.icon]}
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
