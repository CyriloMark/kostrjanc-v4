import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as style from "../../styles";

import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from "react-native-reanimated";

export default function Loading() {
    const indicatorOpacity = useSharedValue(0);

    useEffect(() => {
        intro();
    }, []);

    const intro = async () => {
        await new Promise(resolve => {
            return setTimeout(resolve, 2000);
        });
        indicatorOpacity.value = 1;
    };

    const indicatorStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(indicatorOpacity.value, {
                duration: 250,
                easing: Easing.ease,
            }),
        };
    });

    return (
        <SafeAreaView style={[style.container, style.bgBlack]}>
            <View style={[style.container, styles.container]}>
                <View style={[styles.layer, { flex: 4 }]}>
                    <Image
                        source={require("../../assets/icons/icon.png")}
                        alt="kostrjanc Logo"
                        resizeMethod="auto"
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text
                        style={[
                            style.TlgBd,
                            style.tBlue,
                            { marginTop: style.defaultMsm },
                        ]}>
                        kostrjanc
                    </Text>
                    <Text
                        style={[
                            style.TsmLt,
                            style.tBlue,
                            { marginTop: style.defaultMsm },
                        ]}>
                        1. serbski social media
                    </Text>
                </View>

                <Animated.View
                    style={[styles.layer, indicatorStyles, { flex: 1 }]}>
                    <ActivityIndicator
                        size={"large"}
                        color={style.colors.blue}
                    />
                </Animated.View>

                <View style={[styles.layer, { flex: 1 }]}>
                    <Text style={[style.tWhite, style.TsmLt, style.tCenter]}>
                        Version {require("../../app.json").expo.version}
                        {"\n"}
                        Produced by Mark, Cyril; Baier, Korla{"\n"}© 2022-2025
                        All Rights Reserved
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        // justifyContent: "space-evenly",
        flexDirection: "column",
    },
    layer: {
        width: "100%",
        ...style.allCenter,
    },
    logo: {
        width: "50%",
        maxHeight: 72,
        maxWidth: 72,
    },
});
