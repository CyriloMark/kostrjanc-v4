import React, { useState, useEffect } from "react";

import { View, Text, StyleSheet, Dimensions } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import SVG_Pin from "../../assets/svg/Pin";

import { Banner_Placeholder } from "../../constants/content/PlaceholderData";

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
            <View
                style={[
                    style.border,
                    style.Pmd,
                    style.allCenter,
                    styles.container,
                ]}>
                <View style={styles.signContainer}>
                    <SVG_Pin style={[styles.pin]} fill={style.colors.red} />
                    {/* <Text
                        style={[
                            style.tRed,
                            style.TsmRg,
                            {
                                marginLeft: style.defaultMsm,
                                textTransform: "uppercase",
                            },
                        ]}>
                        Informacije
                    </Text> */}
                </View>
                {/* Txt Container */}
                <View style={styles.textContainer}>
                    {/* Title */}
                    <Text style={[style.TlgRg, style.tRed]}>
                        {banner.title}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
