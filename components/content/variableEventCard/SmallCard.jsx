import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Pressable,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from "react-native";

import * as style from "../../../styles";

//#region Constants
import { convertTimestampToString } from "../../../constants/time";
import { checkIfLive } from "../../../constants/event";
import { create } from "../../../constants/content/create";
import { checkLinkedUser } from "../../../constants/content/linking";
import { getUnsignedTranslationText } from "../../../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
} from "../../../constants/content";
//#endregion

import { LinearGradient } from "expo-linear-gradient";

import Map from "../../event/Map";

import SVG_Live from "../../../assets/svg/Live";

export default function SmallCard({ event, creator, onPress }) {
    const mapRef = useRef();

    return (
        <Pressable style={[styles.container, style.oHidden]} onPress={onPress}>
            <Map
                style={style.allMax}
                mapRef={mapRef}
                initialRegion={event.geoCords}
                marker
                accessible={false}
                title={event.title}
                onPress={onPress}
                align={1.5}
            />

            <View style={[style.allMax, styles.contentContainer]}>
                <LinearGradient
                    colors={[style.colors.black, "transparent"]}
                    start={{
                        x: 0,
                        y: 0,
                    }}
                    end={{
                        x: 1,
                        y: 0.75,
                    }}
                    style={style.allMax}>
                    <View style={[styles.contentInnerContainer]}>
                        {/* Event Title */}
                        <Text
                            numberOfLines={2}
                            style={[style.tWhite, style.TlgBd]}>
                            {checkLinkedUser(
                                getUnsignedTranslationText(
                                    checkForUnnecessaryNewLine(event.title)
                                )
                            ).map((el, key) =>
                                !el.isLinked ? (
                                    checkForURLs(el.text).map((el2, key2) =>
                                        !el2.hasUrl ? (
                                            <Text key={key2}>{el2.text}</Text>
                                        ) : (
                                            <Text
                                                key={key2}
                                                style={[
                                                    style.tBlue,
                                                    {
                                                        textDecorationLine:
                                                            "underline",
                                                        textDecorationColor:
                                                            style.colors.blue,
                                                    },
                                                ]}>
                                                {el2.text}
                                            </Text>
                                        )
                                    )
                                ) : (
                                    <Text key={key} style={style.tBlue}>
                                        {el.text}
                                    </Text>
                                )
                            )}
                        </Text>

                        {/* Event Time Starting */}
                        <View style={styles.timeContainer}>
                            {checkIfLive(event.starting, event.ending) ? (
                                <SVG_Live
                                    fill={style.colors.red}
                                    style={styles.liveIcon}
                                />
                            ) : null}
                            <Text style={[style.tWhite, style.Tmd]}>
                                {convertTimestampToString(event.starting)}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: Math.min(Dimensions.get("screen").height / 8, 206),
        backgroundColor: "red",
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
        padding: style.Plg.paddingVertical,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },

    timeContainer: {
        flexDirection: "row",
        marginTop: style.defaultMsm,
        alignItems: "center",
    },
    liveIcon: {
        height: 20,
        width: 24,
        marginTop: 2,
        marginRight: style.defaultMsm,
    },
});
