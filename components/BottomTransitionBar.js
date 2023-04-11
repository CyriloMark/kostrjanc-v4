import React from "react";

import * as s from "../styles";

import { StyleSheet, View } from "react-native";

import Svg, { LinearGradient, Rect, Defs, Stop } from "react-native-svg";

export default function BottomTransitionBar({ style }) {
    // return <View />;
    return (
        <Svg viewBox="0 0 10 10" style={[style, styles.container]}>
            <Defs>
                <LinearGradient id="gradient" gradientTransform="rotate(90)">
                    <Stop
                        offset={"25%"}
                        stopColor={s.colors.black}
                        stopOpacity={0}
                    />
                    <Stop
                        offset={"50%"}
                        stopColor={s.colors.black}
                        stopOpacity={0.25}
                    />
                    <Stop
                        offset={"100%"}
                        stopColor={s.colors.black}
                        stopOpacity={1}
                    />
                </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={10} height={10} fill={"url(#gradient)"} />
        </Svg>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        minHeight: 12,
        zIndex: 10,
        opacity: 1,
        position: "absolute",
        transform: [
            {
                scaleX: 100,
            },
        ],
        // backgroundColor: "red",
    },
});
