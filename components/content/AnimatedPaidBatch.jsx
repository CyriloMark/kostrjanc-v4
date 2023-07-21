import React from "react";

import { View, StyleSheet, Text, Image, Pressable } from "react-native";

import * as style from "../../styles";

import { Circle, Svg } from "react-native-svg";

import SVG_kostrjanc from "../../assets/svg/kostrjanc";
import SVG_Add from "../../assets/svg/Add";

export default function AnimatedPaidBatch() {
    const size = 58;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <Circle
                    stroke={style.colors.red}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={style.colors.blue}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={
                        circumference - (circumference * 25) / 100
                    }
                />
                <View style={[style.Psm, style.allMax, styles.absolute]}>
                    <SVG_kostrjanc fill={style.colors.red} />
                </View>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...style.allCenter,
    },
    absolute: {
        position: "absolute",
    },
});
