import React, { useState } from "react";

import {
    View,
    TextInput,
    StyleSheet,
    Pressable,
    Dimensions,
    Text,
} from "react-native";

import * as s from "../styles";

import { getLangs } from "../constants/langs";

import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    Easing,
} from "react-native-reanimated";

export default function TextField(props) {
    const [isFocused, setIsFocused] = useState(false);

    const autoCorrectContainerHeight = useSharedValue(0);
    const autoCorrectContainerHeightStyle = useAnimatedStyle(() => {
        return {
            minHeight: withTiming(autoCorrectContainerHeight.value, {
                duration: 250,
                easing: Easing.ease,
            }),
        };
    });
    let onFocus = () => {
        if (!props.supportsAutoCorrect) return;
        setIsFocused(true);
        autoCorrectContainerHeight.value = Dimensions.get("window").height / 2;
    };
    let onBlur = () => {
        if (!props.supportsAutoCorrect) return;
        setIsFocused(false);
        autoCorrectContainerHeight.value = 0;
    };

    return (
        <View style={[props.style, { position: "relative" }]}>
            <View
                style={[
                    styles.container,
                    s.border,
                    s.oHidden,
                    s.Pmd,
                    {
                        zIndex: 10,
                        borderColor: s.colors.blue,
                        alignItems: "center",
                    },
                    props.bg ? { backgroundColor: props.bg } : null,
                ]}>
                <TextInput
                    ref={props.reference ? props.reference : null}
                    {...props}
                    allowFontScaling
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    cursorColor={s.colors.blue}
                    multiline
                    numberOfLines={3}
                    hitSlop={40}
                    maxLength={props.maxLength ? props.maxLength : 512}
                    keyboardAppearance="dark"
                    keyboardType="default"
                    defaultValue={props.defaultValue ? props.defaultValue : ""}
                    placeholder={props.placeholder ? props.placeholder : ""}
                    style={[styles.input, s.tWhite, s.Tmd]}
                    onChangeText={val => {
                        props.onChangeText(val);
                    }}
                    placeholderTextColor={s.colors.blue}
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </View>
            {props.supportsAutoCorrect && isFocused ? (
                <Animated.View
                    style={[
                        styles.autoCorrectContainer,
                        autoCorrectContainerHeightStyle,
                        s.border,
                        s.oHidden,
                        s.Pmd,
                    ]}>
                    <Text style={[s.Tmd, s.tBlue]}>
                        {getLangs("spellcheck_title")}
                    </Text>
                    <View style={styles.autoCorrectContentContainer}>
                        {props.autoCorrection.status === 100 ? (
                            <Text style={[s.tWhite, s.Tmd]}>
                                {getLangs("spellcheck_100")}
                            </Text>
                        ) : props.autoCorrection.status === 200 ? (
                            <Text style={[s.tWhite, s.Tmd]}>
                                {getLangs("spellcheck_200")}
                            </Text>
                        ) : (
                            props.autoCorrection.content.map((word, key) => (
                                <Pressable
                                    key={key}
                                    onPress={() =>
                                        props.applyAutoCorrection(word)
                                    }
                                    style={[
                                        s.Psm,
                                        styles.autoCorrectContentElement,
                                        s.allCenter,
                                        s.border,
                                    ]}>
                                    <Text style={[s.tWhite, s.TsmRg]}>
                                        {word}
                                    </Text>
                                </Pressable>
                            ))
                        )}
                    </View>
                </Animated.View>
            ) : null}
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

    autoCorrectContainer: {
        width: "100%",
        marginTop: s.defaultMmd,
        borderRadius: 10,
        borderColor: s.colors.blue,
    },
    autoCorrectContentContainer: {
        marginTop: s.defaultMmd,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    autoCorrectContentElement: {
        margin: s.defaultMsm,
        borderRadius: 10,
        borderColor: s.colors.white,
    },
});
