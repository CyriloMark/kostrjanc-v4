import React, { useState, useRef } from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import SVG_Basket from "../../assets/svg/Basket";

export default function DeleteButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.allCenter, { padding: s.Pmd.paddingHorizontal }]}
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <SVG_Basket
                        style={[s.boxShadow, s.oVisible, styles.icon]}
                        fill={s.colors.black}
                    />
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
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },
});
