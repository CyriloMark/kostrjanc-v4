import React from "react";
import { View, Pressable, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Add from "../../assets/svg/Add";
import { Rect, Svg } from "react-native-svg";

export default function JoinButton({ style, onPress, checked }) {
    // checked
    if (checked) {
        return (
            <View style={[style, styles.shadowRed, s.bgBlack]}>
                <Pressable
                    style={[styles.container, s.oHidden]}
                    onPress={onPress}>
                    <LinearGradient
                        style={[s.Pmd, s.allCenter, styles.inner]}
                        colors={[s.colors.red, s.colors.white]}
                        end={{ x: 0.5, y: 2.5 }}
                        locations={[0, 0.75]}>
                        <View>
                            <Svg
                                style={[s.boxShadow, s.oVisible, styles.icon]}
                                viewBox="0 0 5 5"
                                fill={s.colors.white}>
                                <Rect y={2} height={1} width={5} rx={0.25} />
                            </Svg>
                        </View>
                        <Text
                            style={[
                                s.tWhite,
                                s.Tmd,
                                { marginLeft: s.defaultMmd },
                            ]}>
                            {getLangs("grouppage_leave")}
                        </Text>
                    </LinearGradient>
                </Pressable>
            </View>
        );
    } else {
        //Not checked
        return (
            <View style={[style, styles.shadowBlue, s.bgBlack]}>
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
                            {getLangs("grouppage_join")}
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
    inner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    icon: {
        aspectRatio: 1,
        maxWidth: 12,
        maxHeight: 12,
    },
    shadowRed: {
        shadowColor: s.colors.red,
        overflow: "visible",
        shadowOpacity: 0.33,
        shadowRadius: 25,
        shadowOffset: { height: 0, width: 0 },
        elevation: 5,

        borderRadius: 25,
    },
    shadowBlue: {
        shadowColor: s.colors.blue,
        overflow: "visible",
        shadowOpacity: 0.33,
        shadowRadius: 25,
        shadowOffset: { height: 0, width: 0 },
        elevation: 5,
        borderRadius: 25,
    },
});
