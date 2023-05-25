import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

export default function ListButton({ style, onPress, title }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <Text style={[s.tWhite, s.Tmd]}>{title}</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 32,
        minHeight: 32,
        maxHeight: 58,
        borderRadius: 25,
    },
});
