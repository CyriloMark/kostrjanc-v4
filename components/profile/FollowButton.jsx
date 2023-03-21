import React from "react";
import { View, Pressable, StyleSheet, Text, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import * as s from "../../styles";

import { getLangs } from "../../constants/langs";

import SVG_Add from "../../assets/svg/Add";
import { Rect, Svg } from "react-native-svg";

export default function FollowButton({ style, onPress, checked }) {
    // checked
    if (checked) {
        return (
            <View style={style}>
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
                            {getLangs("followbtn_unfollow")}
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
                            {getLangs("followbtn_follow")}
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
});
