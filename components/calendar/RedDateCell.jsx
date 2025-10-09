import React from "react";

import { View, Text, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import { DEFAULT_DATEBOX_WIDTH } from "../../constants/calendar";

export default function RedDateCell({ style, text, onPress }) {
    return (
        <View style={[styles.shadow, s.oVisible, style]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.allCenter, s.allMax, styles.inner]}
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
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
        shadowOpacity: 0.33,
        shadowColor: s.colors.red,
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
        aspectRatio: 1,
        width: DEFAULT_DATEBOX_WIDTH,
        borderRadius: 100,
    },

    inner: {
        padding: 4,
    },
});
