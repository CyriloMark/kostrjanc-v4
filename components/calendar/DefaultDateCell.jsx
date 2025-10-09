import React from "react";

import { View, Text, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import { DEFAULT_DATEBOX_WIDTH } from "../../constants/calendar";

export default function DefaultDateCell({ style, text, onPress }) {
    return (
        <View style={[style]}>
            <Pressable
                style={[styles.container, s.oVisible, s.allCenter]}
                onPress={onPress}>
                <Text
                    style={[
                        s.tWhite,
                        s.TsmRg,
                        styles.textShadow,
                        { fontFamily: "Barlow_Bold" },
                    ]}>
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "transparent",

        aspectRatio: 1,
        width: DEFAULT_DATEBOX_WIDTH,
        padding: 4,
    },

    textShadow: {
        shadowColor: s.colors.white,
        shadowOpacity: 0.5,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
});
