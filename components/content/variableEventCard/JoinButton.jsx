import React, { useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

import * as s from "../../../styles";

import Animated, {
    withTiming,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { getLangs } from "../../../constants/langs";

import SVG_Return from "../../../assets/svg/Return";
import SVG_Checked from "../../../assets/svg/Checked";

const MAX_TRANSLATE_X = 8;
export default function JoinButton({ style, onPress, checked }) {
    //#region Arrow Animation
    const arrowStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withRepeat(
                        withSequence(
                            withDelay(
                                2500,
                                withTiming(MAX_TRANSLATE_X, {
                                    duration: 500,
                                    easing: Easing.bezier(0.26, 0.82, 0.8, 1),
                                })
                            ),
                            withTiming(0, {
                                duration: 300,
                                easing: Easing.bezier(0.4, 0, 0.51, 0.83),
                            })
                        ),
                        0,
                        false
                    ),
                },
            ],
        };
    });
    //#endregion

    return (
        <View style={[style, styles.shadow, s.oVisible]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter, styles.innerContainer]}
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
                    locations={[0, 0.75]}>
                    <Text
                        style={[
                            s.tBlack,
                            s.Tmd,
                            { fontFamily: "Barlow_Bold" },
                        ]}>
                        {getLangs("checkbtn_check")}
                    </Text>

                    {!checked ? (
                        <Animated.View
                            style={[styles.arrowContainer, arrowStyles]}>
                            <SVG_Return
                                fill={s.colors.black}
                                rotation={0}
                                style={styles.arrowIcon}
                            />
                        </Animated.View>
                    ) : (
                        <View style={styles.arrowContainer}>
                            <SVG_Checked
                                fill={s.colors.black}
                                style={[styles.arrowIcon, { marginTop: 2 }]}
                            />
                        </View>
                    )}
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: s.colors.red,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        backgroundColor: s.colors.black,

        borderRadius: 10,
        // borderColor: s.colors.red,
        // borderWidth: 1,
    },
    container: {
        zIndex: 3,
        borderRadius: 10,
    },
    innerContainer: {
        flexDirection: "row",
    },

    arrowContainer: {
        marginLeft: s.defaultMmd,
    },
    arrowIcon: {
        width: 18,
        height: 18,
        aspectRatio: 1,
    },
});
