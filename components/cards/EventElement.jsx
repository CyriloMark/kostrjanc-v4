import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from "react-native";

import * as s from "../../styles";

//#region Constants
import { convertTimestampToString } from "../../constants/time";
import { checkIfLive } from "../../constants/event";
import { create } from "../../constants/content/create";
import { checkLinkedUser } from "../../constants/content/linking";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
} from "../../constants/content";
//#endregion

import { LinearGradient } from "expo-linear-gradient";

import Map from "../event/Map";

import SVG_Live from "../../assets/svg/Live";

export default function EventElement({ event, style, onPress, k }) {
    const mapRef = useRef();

    const [creatorName, setCreatorName] = useState(false);
    useEffect(() => {
        create.getCreatorName(event.creator).then(un => setCreatorName(un));
    }, []);

    if (event.isBanned) return null;
    return (
        <View style={[style, styles.shadow, s.oVisible]} key={k}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <Map
                    style={s.allMax}
                    mapRef={mapRef}
                    initialRegion={event.geoCords}
                    marker
                    accessible={false}
                    title={event.title}
                    onPress={onPress}
                    align={1}
                />

                <View style={[s.allMax, styles.contentContainer]}>
                    <LinearGradient
                        colors={[s.colors.black, "transparent"]}
                        start={{
                            x: 0,
                            y: 0,
                        }}
                        end={{
                            x: 1,
                            y: 0.75,
                        }}
                        style={s.allMax}>
                        <View style={[styles.contentInnerContainer]}>
                            {/* Event Creator */}
                            <LinearGradient
                                colors={["#252D33", "#0F0F09"]}
                                start={{
                                    x: -0.5,
                                    y: -2,
                                }}
                                end={{
                                    x: 1.5,
                                    y: 0.5,
                                }}
                                style={[styles.creatorContainer, s.Psm]}>
                                <Text style={[s.TsmRg, s.tWhite]}>
                                    {creatorName}
                                </Text>
                            </LinearGradient>

                            {/* Event Title */}
                            <Text
                                numberOfLines={2}
                                style={[
                                    s.tWhite,
                                    s.TlgBd,
                                    { marginTop: s.defaultMsm },
                                ]}>
                                {checkLinkedUser(
                                    getUnsignedTranslationText(
                                        checkForUnnecessaryNewLine(event.title)
                                    )
                                ).map((el, key) =>
                                    !el.isLinked ? (
                                        checkForURLs(el.text).map((el2, key2) =>
                                            !el2.hasUrl ? (
                                                <Text key={key2}>
                                                    {el2.text}
                                                </Text>
                                            ) : (
                                                <Text
                                                    key={key2}
                                                    style={[
                                                        s.tBlue,
                                                        {
                                                            textDecorationLine:
                                                                "underline",
                                                            textDecorationColor:
                                                                s.colors.blue,
                                                        },
                                                    ]}>
                                                    {el2.text}
                                                </Text>
                                            )
                                        )
                                    ) : (
                                        <Text key={key} style={s.tBlue}>
                                            {el.text}
                                        </Text>
                                    )
                                )}
                            </Text>

                            {/* Event Time Starting */}
                            <View style={styles.timeContainer}>
                                {checkIfLive(event.starting, event.ending) ? (
                                    <SVG_Live
                                        fill={s.colors.red}
                                        style={styles.liveIcon}
                                    />
                                ) : null}
                                <Text
                                    style={[
                                        s.tWhite,
                                        s.Tmd,
                                        // {
                                        //     fontFamily: "Barlow_Bold",
                                        // },
                                    ]}>
                                    {convertTimestampToString(event.starting)}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        alignSelf: "center",
        width: "100%",

        // Shadow
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowColor: s.colors.sec,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        borderRadius: 10,
        backgroundColor: s.colors.black,

        borderColor: s.colors.sec,
        borderWidth: 1,
    },
    container: {
        width: "100%",
        height: Math.min(Dimensions.get("screen").height / 5, 256),
        borderRadius: 10,
        flexDirection: "row",
        zIndex: 3,
    },

    contentContainer: {
        flex: 1,
        position: "absolute",
    },
    contentInnerContainer: {
        width: "75%",
        height: "100%",
        padding: s.Plg.paddingVertical,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },

    creatorContainer: {
        borderRadius: 5,
    },

    timeContainer: {
        flexDirection: "row",
        marginTop: s.defaultMsm,
        alignItems: "center",
    },
    liveIcon: {
        height: 20,
        width: 24,
        marginTop: 2,
        marginRight: s.defaultMsm,
    },
});
