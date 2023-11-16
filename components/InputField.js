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

/*
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
                    ref={props.optRef ? props.optRef : null}
                    allowFontScaling
                    autoCorrect
                    cursorColor={s.colors.blue}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={props.maxLength ? props.maxLength : 128}
                    hitSlop={40}
                    keyboardAppearance="dark"
                    keyboardType={
                        props.keyboardType ? props.keyboardType : "default"
                    }
                    placeholder={props.placeholder}
                    style={[s.allMax, s.tWhite, s.Tmd, s.pH]}
                    onChangeText={val => props.onChangeText(val)}
                    placeholderTextColor={s.colors.blue}
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
*/

export default function InputField(props) {
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
        <View style={[props.style]}>
            <View
                style={[
                    styles.container,
                    s.border,
                    s.oHidden,
                    s.Pmd,
                    props.bg ? { backgroundColor: props.bg } : null,
                ]}>
                <View style={[styles.icon, s.allCenter]}>{props.icon}</View>
                <TextInput
                    ref={props.optRef ? props.optRef : null}
                    allowFontScaling
                    autoCorrect={false}
                    cursorColor={s.colors.blue}
                    multiline={false}
                    numberOfLines={1}
                    maxLength={props.maxLength ? props.maxLength : 128}
                    hitSlop={40}
                    keyboardAppearance="dark"
                    keyboardType={
                        props.keyboardType ? props.keyboardType : "default"
                    }
                    placeholder={props.placeholder}
                    style={[s.allMax, s.tWhite, s.Tmd, s.pH]}
                    onChangeText={val => props.onChangeText(val)}
                    placeholderTextColor={s.colors.blue}
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...props}
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
        flexDirection: "row",
        borderRadius: 10,
        zIndex: 10,
        borderColor: s.colors.blue,
        alignItems: "center",
        height: 58,
    },
    icon: {
        aspectRatio: 1,
        height: "100%",
        maxHeight: 24,
        maxWidth: 24,
        marginRight: s.defaultMsm,
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
