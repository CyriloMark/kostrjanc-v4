import React from "react";

import { View, TextInput, StyleSheet } from "react-native";

import * as style from "../styles";

export default function TextField(props) {
    return (
        <View style={[props.style, { position: "relative" }]}>
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
                    {...props}
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
                    defaultValue={props.defaultValue ? props.defaultValue : ""}
                    placeholder={props.placeholder ? props.placeholder : ""}
                    style={[styles.input, style.tWhite, style.Tmd]}
                    onChangeText={val => {
                        props.onChangeText(val);
                    }}
                    placeholderTextColor={style.colors.blue}
                    inputAccessoryViewID={
                        props.inputAccessoryViewID
                            ? props.inputAccessoryViewID
                            : null
                    }
                    editable={props.editable ? props.editable : true}
                    scrollEnabled
                    selectTextOnFocus
                    textAlign="left"
                    value={props.value}
                    textAlignVertical="top"
                    textBreakStrategy="simple"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 152,
        borderRadius: 10,
    },
    input: {
        width: "100%",
        flex: 1,
    },
});
