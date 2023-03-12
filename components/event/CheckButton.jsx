import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

export default function CheckButton({ style, onPress, checked }) {
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
                        <Text style={[s.tBlack, s.Tmd]}>
                            {getLangs("checkbtn_uncheck")}
                        </Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    } else {
        //Not checked
        return (
            <View style={style}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, s.allCenter]}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <Text style={[s.tWhite, s.Tmd]}>
                            {getLangs("checkbtn_check")}
                        </Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 58,
        maxWidth: Dimensions.get("screen").width / 2,
        borderRadius: 25,
    },
});
