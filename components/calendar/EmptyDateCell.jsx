import React from "react";

import { View, Text, Pressable, StyleSheet } from "react-native";

import * as s from "../../styles";

import { DEFAULT_DATEBOX_WIDTH } from "../../constants/calendar";

export default function EmptyDateCell({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container]} onPress={onPress}>
                <Text
                    style={[s.tBlack, s.TsmRg, { fontFamily: "Barlow_Bold" }]}>
                    {"Hal"}
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
});
