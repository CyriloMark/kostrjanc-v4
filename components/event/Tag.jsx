import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

import * as style from "../../styles";
import { LinearGradient } from "expo-linear-gradient";

export default function Tag(props) {
    return (
        <View
            style={[
                props.style,
                style.oVisible,
                props.checked ? styles.shadowRed : styles.shadowBlue,
            ]}>
            <Pressable
                style={[style.oHidden, styles.container]}
                onPress={props.onPress}>
                {!props.checked ? (
                    <LinearGradient
                        colors={[style.colors.blue, style.colors.sec]}
                        end={{ x: -0.5, y: 0.5 }}
                        locations={[0, 0.75]}
                        style={[style.allCenter, style.Psm, styles.container]}>
                        <Text
                            style={[
                                style.TsmRg,
                                style.tBlack,
                                {
                                    textAlign: "center",
                                    fontFamily: "Barlow_Bold",
                                },
                            ]}>
                            {props.title}
                        </Text>
                    </LinearGradient>
                ) : (
                    <LinearGradient
                        colors={[style.colors.red, style.colors.white]}
                        end={{ x: 0.5, y: 2.5 }}
                        locations={[0, 0.75]}
                        style={[style.allCenter, style.Psm, styles.container]}>
                        <Text
                            style={[
                                style.TsmRg,
                                style.tBlack,
                                {
                                    textAlign: "center",
                                    fontFamily: "Barlow_Bold",
                                },
                            ]}>
                            {props.title}
                        </Text>
                    </LinearGradient>
                )}
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        // width: "100%",
        borderRadius: 9,
    },
    shadowBlue: {
        // Shadow
        shadowRadius: 5,
        shadowOpacity: 0.25,
        shadowColor: style.colors.blue,
        // shadowOffset: {
        //     width: 0,
        //     height: -2,
        // },
        borderRadius: 10,
        backgroundColor: style.colors.black,

        borderColor: style.colors.sec,
        borderWidth: 1,
    },
    shadowRed: {
        // Shadow
        shadowRadius: 5,
        shadowOpacity: 0.4,
        shadowColor: style.colors.red,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: style.colors.black,

        borderColor: style.colors.red,
        borderWidth: 1,
    },
});
