import React from "react";
import { View, Pressable, StyleSheet, Text, Dimensions } from "react-native";

import * as s from "../../styles";

import SVG_Warn from "../../assets/svg/Warn";

import { LinearGradient } from "expo-linear-gradient";

export default function DangerButton({ style, title, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Plg, styles.inner, s.allCenter]}
                    colors={[s.colors.red, s.colors.white]}
                    end={{ x: 0.5, y: 2.5 }}
                    locations={[0, 0.75]}>
                    <SVG_Warn
                        old
                        style={[s.boxShadow, s.oVisible, styles.icon]}
                        fill={s.colors.white}
                    />
                    <Text
                        style={[
                            s.tWhite,
                            s.Tmd,
                            { marginHorizontal: s.defaultMmd },
                        ]}>
                        {title}
                    </Text>
                    <SVG_Warn
                        old
                        style={[s.boxShadow, s.oVisible, styles.icon]}
                        fill={s.colors.white}
                    />
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        borderRadius: 25,
    },
    inner: {
        flexDirection: "row",
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 24,
        maxHeight: 24,
    },
});
