import React, { useEffect } from "react";

import { View, StyleSheet, Pressable, Text, Image } from "react-native";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { getLangs } from "../../constants/langs";

export default function ChallengeSubmitButton({ style, onPress, active }) {
    const activeVal = useSharedValue(0);

    const shadowStyles = useAnimatedStyle(() => {
        return {
            marginTop:
                s.defaultMmd * (1 - activeVal.value) +
                s.defaultMlg * activeVal.value,
            transform: [
                {
                    scale: 0.9 + activeVal.value / 10,
                },
            ],
            shadowRadius: 10 * (1 - activeVal.value) + 20 * activeVal.value,
            shadowOpacity: 0.5 * (1 - activeVal.value) + 0.75 * activeVal.value,
            borderWidth: activeVal.value,
        };
    });

    useEffect(() => {
        activeVal.value = withTiming(active ? 1 : 0, {
            duration: 333,
            easing: Easing.bezier(0.23, 0.57, 0.7, 0.93),
        });
    }, [active]);

    return (
        <Animated.View
            style={[
                style,
                styles.shadow,
                shadowStyles,
                s.oVisible,
                { opacity: active ? 1 : 0.75 },
            ]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <Image
                    style={styles.image}
                    source={require("../../assets/img/group_img_challenge.png")}
                    resizeMode="cover"
                    resizeMethod="resize"
                />

                <View style={[s.allMax, styles.contentContainer]}>
                    <LinearGradient
                        colors={["transparent", s.colors.black]}
                        style={[styles.contentInnerContainer, s.pH]}>
                        <Text
                            style={[
                                s.tWhite,
                                s.Tmd,
                                {
                                    fontFamily: "Barlow_Bold",
                                    textAlign: "center",
                                },
                            ]}>
                            {getLangs("destselect_challengebutton_title")}
                        </Text>
                        <Text
                            style={[
                                s.tWhite,
                                s.TsmRg,
                                {
                                    marginVertical: s.defaultMsm,
                                    textAlign: "center",
                                },
                            ]}>
                            {active
                                ? getLangs(
                                      "postcreate_challengeselect_button_select"
                                  )
                                : getLangs(
                                      "postcreate_challengeselect_alreadysent"
                                  )}
                        </Text>
                    </LinearGradient>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        alignSelf: "center",
        width: "75%",

        // Shadow
        shadowColor: "#8829ac",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: "#AE32DB",
    },
    container: {
        width: "100%",
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
        aspectRatio: 2,
    },
    innerContainer: {
        ...s.allMax,
    },
    image: {
        width: "100%",
        height: "100%",
    },

    contentContainer: {
        position: "relative",
        flex: 1,
        justifyContent: "flex-end",
    },
    contentInnerContainer: {
        width: "100%",
        aspectRatio: 3 / 2,
        justifyContent: "flex-end",
        paddingVertical: s.Pmd.paddingVertical,
    },
});
