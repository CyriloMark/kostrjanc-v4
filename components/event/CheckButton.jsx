import React from "react";
import { Pressable, View, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Add from "../../assets/svg/Add";
import SVG_Basket from "../../assets/svg/Basket";

export default function CheckButton({ style, onPress, checked }) {
    if (checked) {
        //Checked
        return (
            <View style={[style, s.shadowRed, { borderRadius: 25 }]}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, s.allCenter, styles.inner]}
                        colors={[s.colors.red, s.colors.white]}
                        end={{ x: 0.5, y: 2.5 }}
                        locations={[0, 0.75]}>
                        <View>
                            <SVG_Basket
                                style={[s.boxShadow, s.oVisible, styles.icon]}
                                fill={s.colors.white}
                            />
                        </View>
                        <Text
                            style={[
                                s.tWhite,
                                s.Tmd,
                                { marginLeft: s.defaultMmd },
                            ]}>
                            {getLangs("checkbtn_uncheck")}
                        </Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    } else {
        //Not checked
        return (
            <View style={[style, s.shadowSec, { borderRadius: 25 }]}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, s.allCenter, styles.inner]}
                        colors={[s.colors.blue, s.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <View>
                            <SVG_Add
                                style={[s.boxShadow, s.oVisible, styles.icon2]}
                                fill={s.colors.white}
                            />
                        </View>
                        <Text
                            style={[
                                s.tWhite,
                                s.Tmd,
                                { marginLeft: s.defaultMmd },
                            ]}>
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
        // maxWidth: Dimensions.get("screen").width,
        maxWidth: "100%",
        borderRadius: 25,
    },
    inner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    icon2: {
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 18,
        maxHeight: 18,
    },
});
