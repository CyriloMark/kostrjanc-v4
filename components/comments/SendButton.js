import React, { useState, useRef } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import SVG_Send from "../../assets/svg/Send";

export default function SendButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.allCenter, { padding: s.Pmd.paddingHorizontal }]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    {/* <Text>s</Text> */}
                    <View>
                        <SVG_Send
                            style={[styles.icon, s.boxShadow, s.oVisible]}
                            fill={s.colors.white}
                        />
                    </View>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        maxWidth: 58,
        borderRadius: 25,
        aspectRatio: 1,
    },
    icon: {
        flex: 1,
        aspectRatio: 1,
        minWidth: 12,
        minHeight: 12,
        maxWidth: 24,
        maxHeight: 24,
    },
});
