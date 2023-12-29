import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import * as s from "../../styles";

import SVG_Warn from "../../assets/svg/Warn";

import { LinearGradient } from "expo-linear-gradient";

export default function WarnButton({ style, text, sub, onPress }) {
    // return (
    //     <View style={style}>
    //         <Pressable
    //             style={[s.border, s.Pmd, s.allCenter, styles.container]}
    //             onPress={onPress}>
    //             <View style={styles.signContainer}>
    //                 <SVG_Warn old style={[styles.pin]} fill={s.colors.red} />
    //             </View>
    //             {/* Txt Container */}
    //             <View style={styles.textContainer}>
    //                 {/* Title */}
    //                 <Text style={[s.TlgRg, s.tRed]}>{text}</Text>
    //                 <Text
    //                     style={[s.TsmRg, s.tRed, { marginTop: s.defaultMsm }]}>
    //                     {sub}
    //                 </Text>
    //             </View>
    //         </Pressable>
    //     </View>
    // );

    return (
        <Pressable style={style} onPress={onPress}>
            <LinearGradient
                style={[s.Pmd, s.allCenter, styles.container]}
                colors={[s.colors.red, s.colors.white]}
                end={{ x: 0.5, y: 2.5 }}
                locations={[0, 0.75]}>
                {/* Pin Sign: Banner Symbol | Container */}
                <View style={styles.signContainer}>
                    <SVG_Warn old style={[styles.pin]} fill={s.colors.black} />
                </View>

                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[s.TlgBd, s.tBlack]}>{text}</Text>
                    <Text
                        style={[
                            s.TsmRg,
                            s.tBlack,
                            { marginTop: s.defaultMsm },
                        ]}>
                        {sub}
                    </Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
    },
    signContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 12,
        maxWidth: 12,
    },

    textContainer: {
        marginTop: s.defaultMsm,
        width: "100%",
        flexDirection: "column",
    },
});
