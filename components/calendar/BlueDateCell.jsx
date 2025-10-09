import React from "react";

import { View, Text, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import { DEFAULT_DATEBOX_WIDTH } from "../../constants/calendar";

export default function BlueDateCell({ style, text, onPress }) {
    return (
        <View style={[styles.shadow, s.oVisible, style]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.allCenter, s.allMax, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <Text
                        style={[
                            s.tBlack,
                            s.TsmRg,
                            { fontFamily: "Barlow_Bold" },
                        ]}>
                        {text}
                    </Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowRadius: 10,
        shadowOpacity: 0.66,
        shadowColor: s.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 100,
        backgroundColor: s.colors.black,

        borderColor: s.colors.sec,
        borderWidth: 1,
    },
    container: {
        width: DEFAULT_DATEBOX_WIDTH,
        aspectRatio: 1,
        borderRadius: 100,
    },

    inner: {
        padding: 4,
    },
});
