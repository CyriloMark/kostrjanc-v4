import React from "react";

import { View, StyleSheet, Text, Image, Pressable } from "react-native";

import * as style from "../../styles";

import { Svg, Rect } from "react-native-svg";
import { clamp } from "../../constants/clamp";

export default function ContentHeader(props) {
    return (
        <View style={[styles.container, style.Pmd]}>
            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onContentPress}>
                <Svg viewBox="0 0 5 5">
                    <Rect
                        x={0}
                        y={0}
                        width={5 * clamp(Math.random(), 0.6, 1)}
                        height={1}
                        fill={style.colors.blue}></Rect>
                    <Rect
                        x={0}
                        y={2}
                        width={5 * clamp(Math.random(), 0.4, 0.8)}
                        height={1}
                        fill={style.colors.sec}></Rect>
                    <Rect
                        x={0}
                        y={4}
                        width={5 * clamp(Math.random(), 0.6, 1)}
                        height={1}
                        fill={style.colors.blue}></Rect>
                </Svg>
            </Pressable>

            <View style={[styles.titleContainer, style.allCenter]}>
                <Text style={[style.TlgBd, style.tWhite]}>kostrjanc</Text>
            </View>

            <View style={[styles.btnContainer, style.allCenter]}>
                <Pressable
                    style={styles.pbContainer}
                    onPress={props.onUserPress}>
                    <Image
                        source={{ uri: props.pb }}
                        style={styles.pb}
                        resizeMode="cover"
                        resizeMethod="auto"
                    />
                </Pressable>
            </View>
        </View>
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
        marginRight: style.defaultMsm,
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
