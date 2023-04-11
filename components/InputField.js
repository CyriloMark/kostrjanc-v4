import React from "react";

import { View, TextInput, StyleSheet } from "react-native";

import * as s from "../styles";

export default function InputField(props) {
    return (
        <View style={[props.style, { maxHeight: 58 }]}>
            <View
                style={[
                    styles.container,
                    s.border,
                    s.oHidden,
                    s.allMax,
                    s.Pmd,
                    props.bg ? { backgroundColor: props.bg } : null,
                ]}>
                <View style={[styles.icon, s.allCenter]}>{props.icon}</View>
                <TextInput
                    allowFontScaling
                    autoCorrect
                    cursorColor={s.colors.blue}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={128}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    placeholder={props.placeholder}
                    style={[s.allMax, s.tWhite, s.Tmd, s.pH]}
                    onChangeText={val => props.onChangeText(val)}
                    placeholderTextColor={s.colors.sec}
                    scrollEnabled
                    selectTextOnFocus
                    inputAccessoryViewID={
                        props.inputAccessoryViewID
                            ? props.inputAccessoryViewID
                            : ""
                    }
                    textAlign="left"
                    value={props.value}
                    textAlignVertical="center"
                    textBreakStrategy="simple"
                    {...props}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 10,
        zIndex: 10,
        borderColor: s.colors.sec,
        alignItems: "center",
        maxHeight: 58,
    },
    icon: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: s.defaultMsm,
    },
});
