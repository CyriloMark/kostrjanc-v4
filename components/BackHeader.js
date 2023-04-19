import React from "react";
import { View, StyleSheet, Text, Pressable, Platform } from "react-native";

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
                <SVG_Return
                    fill={style.colors.blue}
                    rotation={180}
                    style={style.boxShadow}
                />
            </Pressable>

            <View style={[styles.titleContainer, style.allCenter]}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                        style.TlgBd,
                        style.tWhite,
                        style.boxShadow,
                        { marginHorizontal: style.defaultMmd },
                    ]}>
                    {props.title}
                </Text>
            </View>

            {/* Android Only No refreshControl -> refresh btn */}
            {Platform.OS === "android" && props.showReload ? (
                <Pressable
                    style={[styles.btnContainer, style.allCenter]}
                    onPress={props.onReload}>
                    <SVG_Reload
                        fill={style.colors.blue}
                        style={style.boxShadow}
                        rotation={180}
                    />
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
