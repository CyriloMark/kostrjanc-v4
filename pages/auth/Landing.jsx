import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

import * as style from "../../styles";

import AppHeader from "../../components/auth/AppHeader";

import Svg, { Path } from "react-native-svg";

import Animated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    withSpring,
    Easing,
} from "react-native-reanimated";
import { interpolatePath, parse } from "react-native-redash";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Landing({ navigation }) {
    const [accountViewVisible, setAccountViewVisible] = useState(false);

    //#region Arrow/Close Animation
    const progress = useSharedValue(0);
    const p1 = parse(
        "m25,184h389.14S279.93,44.39,279.93,44.39c-9.76-10.16-9.76-26.62,0-36.78h0c9.76-10.16,25.59-10.16,35.35,0l174.2,181.2c6.36,4.71,10.51,12.44,10.51,21.19h0c0,8.74-4.15,16.47-10.51,21.19l-174.2,181.2c-9.76,10.16-25.59,10.16-35.35,0h0c-9.76-10.16-9.76-26.62,0-36.78l134.21-139.6H25c-13.81,0-25-11.64-25-26h0c0-14.36,11.19-26,25-26Z"
    );
    const p2 = parse(
        "m290.33,210L451.65,48.68c11.14-11.14,11.14-29.19,0-40.33h0c-11.14-11.14-29.19-11.14-40.33,0l-161.32,161.32L88.68,8.35c-11.14-11.14-29.19-11.14-40.33,0h0c-11.14,11.14-11.14,29.19,0,40.33l161.32,161.32L48.35,371.32c-11.14,11.14-11.14,29.19,0,40.33,11.14,11.14,29.19,11.14,40.33,0l161.32-161.32,161.32,161.32c11.14,11.14,29.19,11.14,40.33,0h0c11.14-11.14,11.14-29.19,0-40.33l-161.32-161.32Z"
    );

    const aniProps = useAnimatedProps(() => {
        const d = interpolatePath(progress.value, [0, 1], [p1, p2]);
        return {
            d,
        };
    });
    //#endregion

    //#region Animation
    const blurBox = useSharedValue(0);

    const startBoxWidth = useSharedValue(102);
    const startBoxBg = useSharedValue(style.colors.blue);

    const topBoxOpacity = useSharedValue(0);
    const topBoxOffset = useSharedValue(0);

    const bottomBoxOpacity = useSharedValue(0);
    const bottomBoxOffset = useSharedValue(0);

    const startBoxStyles = useAnimatedStyle(() => {
        return {
            width: withSpring(startBoxWidth.value, {
                damping: 10,
                stiffness: 90,
            }),
            borderColor: withTiming(startBoxBg.value, {
                duration: 100,
                easing: Easing.ease,
            }),
        };
    });

    const blurBoxStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(
                `rgba(${style.colorsRGB.black},${blurBox.value})`,
                {
                    duration: 200,
                }
            ),
        };
    });

    const topBoxStyles = useAnimatedStyle(() => {
        return {
            top: withSpring(topBoxOffset.value, {
                damping: 10,
                stiffness: 90,
            }),
            opacity: withTiming(topBoxOpacity.value, {
                duration: 100,
                easing: Easing.ease,
            }),
        };
    });

    const bottomBoxStyles = useAnimatedStyle(() => {
        return {
            bottom: withSpring(bottomBoxOffset.value, {
                damping: 10,
                stiffness: 90,
            }),
            opacity: withTiming(bottomBoxOpacity.value, {
                duration: 100,
                easing: Easing.ease,
            }),
        };
    });

    const toggleAccountView = () => {
        setAccountViewVisible(val => {
            progress.value = withTiming(val ? 0 : 1, {
                duration: 250,
                easing: Easing.ease,
            });

            blurBox.value = val ? 0 : 0.8;
            startBoxWidth.value = val ? 102 : 58;
            startBoxBg.value = val ? style.colors.blue : style.colors.sec;

            topBoxOffset.value = val ? 0 : -72;
            topBoxOpacity.value = val ? 0 : 1;

            bottomBoxOffset.value = val ? 0 : -72;
            bottomBoxOpacity.value = val ? 0 : 1;

            return !val;
        });
    };
    //#endregion

    return (
        <View style={[style.container, style.bgBlack]}>
            <AppHeader />

            <View
                style={[
                    style.container,
                    style.pH,
                    styles.container,
                    style.oVisible,
                ]}>
                <Animated.View style={[style.blurBox, blurBoxStyle]} />

                <View style={styles.titleContainer}>
                    <Text style={[style.Ttitle, style.tWhite]}>Witaj pola</Text>
                    <View style={[{ flexDirection: "row" }]}>
                        <Text style={[style.Ttitle, style.tBlue]}>
                            kostrjanc
                        </Text>
                        <Text style={[style.Ttitle, style.tWhite]}>!</Text>
                    </View>
                </View>

                <View style={[styles.subContainer, style.pH]}>
                    <Text style={[style.tWhite, style.Tmd]}>
                        Wšojedne, kak dołho hižo njejsy tu był,{"\n"}
                        abo hač je to samo prěni raz tu.{"\n"}
                        Sy wutrobnje witany!
                    </Text>
                </View>

                <Text
                    style={[
                        style.tWhite,
                        style.TlgBd,
                        { width: "100%", marginTop: style.defaultMlg },
                    ]}>
                    Započinaj twój puć hnydom z kostrjanc:
                </Text>
                {/* Account View */}
                <View style={[style.container, style.allCenter, { zIndex: 5 }]}>
                    <View style={[styles.accountContainer, style.allCenter]}>
                        <Animated.View
                            style={[
                                styles.startBox,
                                style.border,
                                style.Pmd,
                                startBoxStyles,
                            ]}>
                            <Pressable onPress={toggleAccountView}>
                                <Svg
                                    // viewBox="0 0 368.2 368.2"
                                    viewBox="0 0 500 420"
                                    fill={
                                        accountViewVisible
                                            ? style.colors.sec
                                            : style.colors.blue
                                    }>
                                    <AnimatedPath animatedProps={aniProps} />
                                </Svg>
                            </Pressable>
                        </Animated.View>

                        {/* Login */}
                        <Animated.View
                            style={[
                                styles.sideBox,
                                style.allCenter,
                                topBoxStyles,
                            ]}>
                            <Pressable
                                onPress={() => navigation.navigate("login")}
                                style={[
                                    styles.sideBoxInner,
                                    style.Pmd,
                                    style.border,
                                ]}>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    Z starym kontom so přizjewić
                                </Text>
                            </Pressable>
                        </Animated.View>

                        {/* Register */}
                        <Animated.View
                            style={[
                                styles.sideBox,
                                style.allCenter,
                                bottomBoxStyles,
                            ]}>
                            <Pressable
                                onPress={() => navigation.navigate("register")}
                                style={[
                                    styles.sideBoxInner,
                                    style.Pmd,
                                    style.border,
                                ]}>
                                <Text style={[style.tWhite, style.Tmd]}>
                                    Nowy konto wotewrić
                                </Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "flex-start",
        marginTop: style.defaultMsm,
        alignItems: "center",
    },

    titleContainer: {
        flexDirection: "column",
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 1,
    },

    subContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
        zIndex: 1,
    },

    accountContainer: {
        width: "100%",
        // marginTop: style.defaultMlg,
        minHeight: 72,
        zIndex: 5,
        position: "relative",
    },
    startBox: {
        borderColor: style.colors.blue,
        aspectRatio: 1,
        borderRadius: 25,
        zIndex: 9,
    },

    sideBox: {
        position: "absolute",
        height: 72,
        zIndex: 5,
    },
    sideBoxInner: {
        borderColor: style.colors.blue,
        backgroundColor: `rgba(${style.colorsRGB.black}, .75)`,
        borderRadius: 10,
    },
});
