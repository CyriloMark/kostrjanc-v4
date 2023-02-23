import React from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";

import * as style from "../../styles";

import SVG_kostrjanc from "../../assets/svg/kostrjanc";
import { Svg, Rect } from "react-native-svg";

import { clamp } from "../../constants/clamp";
import { LinearGradient } from "expo-linear-gradient";

import { signOut, getAuth } from "firebase/auth";

export default function AppHeader(props) {
    return (
        <LinearGradient
            colors={[style.colors.black, "transparent"]}
            style={[styles.container, style.Pmd, style.allCenter]}>
            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onContentPress}>
                <Svg viewBox="0 0 7 7">
                    <Rect
                        x={0}
                        y={1}
                        width={7 * clamp(Math.random(), 0.6, 1)}
                        rx={0.5}
                        height={1}
                        fill={style.colors.blue}></Rect>
                    <Rect
                        x={0}
                        y={3}
                        rx={0.5}
                        width={7 * clamp(Math.random(), 0.4, 0.8)}
                        height={1}
                        fill={style.colors.sec}></Rect>
                    <Rect
                        x={0}
                        y={5}
                        rx={0.5}
                        width={7 * clamp(Math.random(), 0.6, 1)}
                        height={1}
                        fill={style.colors.blue}></Rect>
                </Svg>
            </Pressable>

            <Pressable
                onLongPress={() => signOut(getAuth())}
                onPress={props.onCenterPress}
                style={[
                    styles.titleContainer,
                    style.allCenter,
                    style.boxShadow,
                ]}>
                <SVG_kostrjanc fill={style.colors.blue} style={styles.icon} />
                <Text style={[style.TlgBd, style.tWhite]}>kostrjanc</Text>
            </Pressable>

            <View style={[styles.btnContainer, style.allCenter]}>
                <Pressable
                    style={styles.pbContainer}
                    onPress={props.onUserPress}>
                    <Image
                        source={{ uri: props.pbUri }}
                        style={styles.pb}
                        resizeMode="cover"
                        resizeMethod="auto"
                    />
                </Pressable>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 58,
        flexDirection: "row",
    },

    btnContainer: {
        flex: 0.1,
        // backgroundColor: "red",
        height: "100%",
    },

    titleContainer: {
        flexDirection: "row",
        flex: 0.8,
    },
    icon: {
        maxHeight: 32,
        maxWidth: 32,
        aspectRatio: 1,
        flex: 0.1,
        marginRight: style.defaultMmd,
    },

    pbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
        overflow: "hidden",
    },
    pb: {
        width: "100%",
        height: "100%",
    },
});
