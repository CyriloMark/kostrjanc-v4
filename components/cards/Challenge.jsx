import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";
import { getLangs } from "../../constants/langs";

import * as style from "../../styles";

import SVG_Pin from "../../assets/svg/Pin";

import { LinearGradient } from "expo-linear-gradient";

export default function Challenge(props) {
    const [challengeTitle, setChallengeTitle] = useState(null);

    useEffect(() => {
        loadChallengeTitle();
    });

    const loadChallengeTitle = () => {
        get(child(ref(getDatabase()), "challenge"))
            .then(rsp => {
                if (!rsp.exists()) setChallengeTitle(null);

                setChallengeTitle(rsp.val());
            })
            .catch(error =>
                console.log(
                    "error",
                    "Challenge get challenge title",
                    error.code
                )
            );
    };

    if (challengeTitle === null) return null;

    return (
        <View style={props.style}>
            <LinearGradient
                style={[style.Pmd, styles.container]}
                colors={["#8829ac", "#ca55e7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                locations={[0, 0.66]}>
                {
                    //#region Pin Sign: Banner Symbol | Container
                }
                <View style={styles.headerContainer}>
                    <SVG_Pin style={[styles.pin]} fill={style.colors.black} />
                    {
                        //#region Header Hint Text
                    }
                    <Text
                        style={[
                            style.TsmRg,
                            style.tBlack,
                            {
                                marginLeft: style.defaultMsm,
                                fontFamily: "Barlow_Bold",
                            },
                        ]}>
                        {getLangs("challengecard_subtitle")}
                    </Text>
                </View>

                {
                    //#region Title
                }
                <Text
                    style={[
                        style.Tquote,
                        style.tBlack,
                        { marginTop: style.defaultMsm },
                    ]}>
                    „<Text style={style.TlgBd}>{challengeTitle}</Text>“
                </Text>

                {/* <Text
                        style={[
                            style.TsmRg,
                            style.tBlack,
                            { marginTop: style.defaultMsm },
                        ]}>
                        {getLangs("challengecard_hint")}
                    </Text> */}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 3,
        borderRadius: 10,
        flexDirection: "column",
        justifyContent: "center",
    },
    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    pin: {
        aspectRatio: 1,
        maxHeight: 12,
        maxWidth: 12,
    },
});
