import React from "react";
import { View, StyleSheet, Pressable, Text, Alert } from "react-native";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import { LinearGradient } from "expo-linear-gradient";

export default function ScoreCounter({ style, count, userName }) {
    const onAlert = () => {
        Alert.alert(
            getLangs("profile_score_title"),
            `${userName}${getLangs("profile_score_sub_1")}${count}${getLangs(
                "profile_score_sub_2"
            )}`,
            [
                {
                    text: "Ok",
                    style: "default",
                    isPreferred: true,
                },
            ]
        );
    };

    return (
        <View style={style}>
            <LinearGradient
                style={[styles.container, s.Psm]}
                colors={["#8829ac", "#ca55e7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.66]}>
                <Pressable onPress={onAlert}>
                    <Text style={[s.tBlack, s.Tmd, styles.text]}>{count}</Text>
                </Pressable>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
    },
    text: {
        fontFamily: "Barlow_Bold",
    },
});
