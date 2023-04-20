import React from "react";

import { View, TextInput, StyleSheet } from "react-native";

import * as style from "../styles";

export default function TextField(props) {
    return (
        <View style={[props.style, { maxHeight: 152 }]}>
            <View
                style={[
                    styles.container,
                    style.border,
                    style.oHidden,
                    style.Pmd,
                    {
                        zIndex: 10,
                        borderColor: style.colors.blue,
                        alignItems: "center",
                    },
                    props.bg ? { backgroundColor: props.bg } : null,
                ]}>
                <TextInput
                    allowFontScaling
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    cursorColor={style.colors.blue}
                    multiline
                    numberOfLines={3}
                    hitSlop={40}
                    maxLength={props.maxLength ? props.maxLength : 512}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    placeholder={props.placeholder}
                    style={[style.allMax, style.tWhite, style.Tmd]}
                    onChangeText={val => props.onChangeText(val)}
                    placeholderTextColor={style.colors.blue}
                    scrollEnabled
                    selectTextOnFocus
                    textAlign="left"
                    value={props.value}
                    textAlignVertical="top"
                    textBreakStrategy="simple"
                    {...props}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
});
