import React from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Add from "../../assets/svg/Add";
import SVG_Post from "../../assets/svg/Post";

export default function NewPostCommentButton({ style, onPress }) {
    return (
        <View style={[style, s.shadowSec, { borderRadius: 25 }]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <SVG_Add
                        style={[s.boxShadow, s.oVisible, styles.plusIcon]}
                        fill={s.colors.white}
                    />
                    <SVG_Post
                        style={[s.boxShadow, s.oVisible, styles.postIcon]}
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
        // maxWidth: Dimensions.get("screen").width,
        maxWidth: "100%",
        borderRadius: 25,
    },
    inner: {
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },

    plusIcon: {
        aspectRatio: 1,
        width: 12,
    },
    postIcon: {
        aspectRatio: 1,
        width: 24,

        marginLeft: s.defaultMsm,
    },
});
