import React from "react";
import { View, Pressable, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import SVG_Pencil from "../../assets/svg/Pencil";
import { Rect, Svg } from "react-native-svg";

export default function EditProfileButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <SVG_Pencil
                        style={[s.boxShadow, s.oVisible, styles.icon]}
                        fill={s.colors.white}
                    />
                    <Text
                        style={[s.tWhite, s.Tmd, { marginLeft: s.defaultMmd }]}>
                        Wobdźěłać
                    </Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        maxWidth: Dimensions.get("screen").width / 2,
        borderRadius: 25,
    },
    inner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
