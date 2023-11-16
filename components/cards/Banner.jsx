import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import SVG_Pin from "../../assets/svg/Pin";

import { Banner_Placeholder } from "../../constants/content/PlaceholderData";
import { LinearGradient } from "expo-linear-gradient";

export default function Banner(props) {
    const [banner, setBanner] = useState(Banner_Placeholder);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "banners/" + props.id))
            .then(bannerSnap => {
                if (bannerSnap.exists()) {
                    const bannerData = bannerSnap.val();
                    setBanner(bannerData);
                }
            })
            .catch(error =>
                console.log("cards/Banner.jsx", "get banner data", error.code)
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={props.style}>
            <LinearGradient
                style={[style.Pmd, style.allCenter, styles.container]}
                colors={[style.colors.red, style.colors.white]}
                end={{ x: 0.5, y: 2.5 }}
                locations={[0, 0.75]}>
                {/* Pin Sign: Banner Symbol | Container */}
                <View style={styles.signContainer}>
                    <SVG_Pin style={[styles.pin]} fill={style.colors.black} />
                </View>

                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[style.TlgBd, style.tBlack]}>
                        {banner.title}
                    </Text>
                    {/* Title */}
                    <Text
                        style={[
                            style.TsmRg,
                            style.tBlack,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {banner.description}
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );

    // Previous Banner: Red border
    return (
        <View style={props.style}>
            <View
                style={[
                    style.border,
                    style.Pmd,
                    style.allCenter,
                    styles.container,
                ]}>
                <View style={styles.signContainer}>
                    <SVG_Pin style={[styles.pin]} fill={style.colors.red} />
                </View>
                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[style.TlgRg, style.tRed]}>
                        {banner.title}
                    </Text>
                    {/* Title */}
                    <Text
                        style={[
                            style.TsmRg,
                            style.tRed,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {banner.description}
                    </Text>
                </View>
            </View>
        </View>
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
        marginTop: style.defaultMsm,
        width: "100%",
        flexDirection: "column",
    },
});

// Old
const styles_ = StyleSheet.create({
    container: {
        marginHorizontal: style.defaultMmd * 2,
        borderColor: style.colors.red,
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
        marginTop: style.defaultMsm,
        width: "100%",
        flexDirection: "column",
    },
});
