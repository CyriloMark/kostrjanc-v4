import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import * as s from "../../styles";

import SVG_Heart from "../../assets/svg/Heart";
import SVG_Coffee from "../../assets/svg/Coffee";

export default function BuyMeACoffeeButton({ style, onPress }) {
    return (
        <View style={style}>
            <Pressable
                style={[s.border, s.Pmd, s.allCenter, styles.container]}
                onPress={onPress}>
                {/* Txt Container */}
                <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                        {/* <View> */}
                        <SVG_Coffee
                            fill={s.colors.red}
                            style={styles.coffeeIcon}
                        />
                        {/* </View> */}
                        {/* Title */}
                        <Text style={[s.TlgRg, s.tRed]}>
                            Kup nam jednu kola
                        </Text>
                    </View>
                    <Text
                        style={[s.TsmRg, s.tRed, { marginTop: s.defaultMsm }]}>
                        Chceš Cyrila a Korlu při dźěle na kostrjanc a dalšich
                        projektach podpěrać, potom móžeš to z darom tu činić. My
                        so přez kóždy fenk wjeselimy.
                    </Text>
                </View>
                <View style={styles.signContainer}>
                    <SVG_Heart style={[styles.pin]} fill={s.colors.red} />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: s.defaultMmd * 2,
        borderColor: s.colors.red,
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
    },
    signContainer: {
        marginTop: s.defaultMmd,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 18,
        maxWidth: 18,
    },

    titleContainer: {
        flexDirection: "row",
    },
    coffeeIcon: {
        minWidth: 24,
        maxHeight: 24,
        height: "100%",
        marginRight: s.defaultMmd,
    },
    textContainer: {
        width: "100%",
        flexDirection: "column",
    },
});
