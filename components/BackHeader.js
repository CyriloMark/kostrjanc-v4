import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    Pressable,
    Platform,
} from "react-native";

import * as style from "../styles";

import { LinearGradient } from "expo-linear-gradient";

import SVG_Return from "../assets/svg/Return";
import SVG_Reload from "../assets/svg/Search";

export default function BackHeader(props) {
    return (
        <LinearGradient
            colors={[style.colors.black, "transparent"]}
            style={[styles.container, style.Pmd, style.allCenter]}>
            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onBack}>
                <SVG_Return fill={style.colors.blue} rotation={180} />
            </Pressable>

            <View
                style={[
                    styles.titleContainer,
                    style.allCenter,
                    style.boxShadow,
                ]}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                        style.TlgBd,
                        style.tWhite,
                        { marginHorizontal: style.defaultMmd },
                    ]}>
                    {props.title}
                </Text>
            </View>

            {/* Android Only No refreshControl -> refresh btn */}
            {Platform.OS === "android" && props.showReload ? (
                <Pressable
                    style={[styles.btnContainer, style.allCenter]}
                    onPress={props.onReloadPress}>
                    <SVG_Reload fill={style.colors.blue} rotation={180} />
                </Pressable>
            ) : (
                <View style={styles.btnContainer} />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 58,
        flexDirection: "row",
        zIndex: 10,
    },

    btnContainer: {
        flex: 0.1,
        height: "100%",
    },

    titleContainer: {
        flexDirection: "row",
        flex: 0.8,
    },
});
