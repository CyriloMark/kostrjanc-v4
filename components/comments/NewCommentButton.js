import React from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Add from "../../assets/svg/Add";

export default function NewCommentButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <LinearGradient
                    style={[s.Pmd, s.allCenter, styles.inner]}
                    colors={[s.colors.blue, s.colors.sec]}
                    end={{ x: -0.5, y: 0.5 }}
                    locations={[0, 0.75]}>
                    <View>
                        <SVG_Add
                            style={[s.boxShadow, s.oVisible, styles.icon]}
                            fill={s.colors.white}
                        />
                    </View>
                    <Text
                        style={[s.tWhite, s.Tmd, { marginLeft: s.defaultMmd }]}>
                        {getLangs("newcomment_type")}
                    </Text>
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
        flexDirection: "row",
        justifyContent: "center",
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },
});
