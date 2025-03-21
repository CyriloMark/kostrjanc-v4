import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

export default function SelectableButton({ checked, style, onPress, title }) {
    if (checked) {
        //Checked
        return (
            <View style={style}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, s.allCenter]}
                        colors={[s.colors.red, s.colors.white]}
                        end={{ x: 0.5, y: 2.5 }}
                        locations={[0, 0.75]}>
                        <Text style={[s.tBlack, s.Tmd]}>{title}</Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    } else {
        //Not checked
        return (
            <View style={style}>
                <Pressable
                    style={[styles.container, s.border, s.Pmd, s.allCenter]}
                    onPress={onPress}>
                    <Text style={[s.tWhite, s.Tmd]}>{title}</Text>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        width: "100%",
        borderColor: s.colors.blue,
    },
});
