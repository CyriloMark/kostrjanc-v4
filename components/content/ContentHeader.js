import React from "react";

import { View, StyleSheet, Text, Image, Pressable } from "react-native";

import * as style from "../../styles";

import { LinearGradient } from "expo-linear-gradient";

import SVG_Settings from "../../assets/svg/Settings";
import SVG_Return from "../../assets/svg/Return";

export default function ContentHeader(props) {
    return (
        // <LinearGradient
        //     colors={[style.colors.black, "transparent"]}
        //     style={[
        //         styles.container,
        //         style.Pmd,
        //         style.allCenter,
        //         { zIndex: 10 },
        //     ]}>
        <View
            style={[
                style.bgBlack,
                styles.container,
                style.Pmd,
                style.allCenter,
                { zIndex: 10 },
            ]}>
            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onSettingsPress}>
                <SVG_Settings
                    fill={style.colors.blue}
                    style={style.boxShadow}
                />
            </Pressable>

            <View style={[styles.titleContainer, style.allCenter]}>
                <Text style={[style.TlgBd, style.tWhite, style.boxShadow]}>
                    kostrjanc
                </Text>
                <View style={[styles.studioContainer, style.oVisible]}>
                    <LinearGradient
                        style={[
                            style.allCenter,
                            styles.shBox,
                            // style.bgBlue,
                            style.Psm,
                            style.oHidden,
                        ]}
                        colors={[style.colors.blue, style.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}>
                        <Text
                            style={[style.TsmRg, style.tWhite, styles.shText]}>
                            studijo
                        </Text>
                    </LinearGradient>
                </View>
            </View>

            <Pressable
                style={[styles.btnContainer, style.allCenter]}
                onPress={props.onBack}>
                <SVG_Return
                    fill={style.colors.blue}
                    style={style.boxShadow}
                    rotation={0}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 58,
        flexDirection: "row",
    },

    btnContainer: {
        flex: 0.1,
        // backgroundColor: "red",
        height: "100%",
    },

    titleContainer: {
        flexDirection: "row",
        flex: 0.8,
    },

    studioContainer: {
        borderRadius: 10,
        marginLeft: style.defaultMmd,
        minHeight: 32,
        alignSelf: "center",

        // Shadow
        shadowRadius: 5,
        shadowOpacity: 0.5,
        shadowColor: style.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        backgroundColor: style.colors.black,

        borderRadius: 10,
        borderColor: style.colors.sec,
        borderWidth: 1,
    },
    shBox: {
        borderRadius: 9,
        minHeight: 32,
    },
    shText: {
        textTransform: "uppercase",
    },

    pbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 58,
        maxHeight: 58,
        borderRadius: 100,
        overflow: "hidden",
    },
    pb: {
        width: "100%",
        height: "100%",
    },
});
