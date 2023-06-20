import React from "react";
import { Pressable, View, StyleSheet } from "react-native";

import * as s from "../../styles";

import SVG_Keyboard from "../../assets/svg/Keyboard";

export default function OpenKeyboardButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable
                style={[
                    styles.container,
                    s.oHidden,
                    { padding: s.Psm.paddingHorizontal },
                ]}
                onPress={onPress}>
                <SVG_Keyboard
                    style={[s.boxShadow, s.oVisible, styles.icon]}
                    fill={s.colors.blue}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        maxWidth: 58,
        borderRadius: 25,
        aspectRatio: 1,
    },
    icon: {
        flex: 1,
        aspectRatio: 1,
        aspectRatio: 1,
        minWidth: 12,
        minHeight: 12,
        maxWidth: 24,
        maxHeight: 24,
    },
});
