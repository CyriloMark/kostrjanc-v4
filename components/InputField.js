import React from "react";

import { View, TextInput, StyleSheet } from "react-native";

import * as style from "../styles";

export default function InputField(props) {
    return (
        <View style={[props.style, { maxHeight: 58 }]}>
            <View
                style={[
                    styles.container,
                    style.border,
                    style.Pmd,
                    {
                        zIndex: 10,
                        borderColor: style.colors.sec,
                        backgroundColor: "rgba(0,0,0,.9)",
                        alignItems: "center",
                    },
                ]}>
                <View style={[styles.icon, style.allCenter]}>{props.icon}</View>
                <TextInput
                    allowFontScaling
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable
                    cursorColor={style.colors.blue}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={128}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    placeholder={props.placeholder}
                    style={[style.allMax, style.tBlue, style.Tmd]}
                    onChangeText={val => props.onChangeText(val)}
                    placeholderTextColor={style.colors.sec}
                    scrollEnabled
                    selectTextOnFocus
                    textAlign="left"
                    value={props.value}
                    textAlignVertical="center"
                    textBreakStrategy="simple"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    icon: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: style.defaultMsm,
    },
});
