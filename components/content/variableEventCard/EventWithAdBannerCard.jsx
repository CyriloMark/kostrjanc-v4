import React, { useEffect, useRef, useState } from "react";

import {
    Pressable,
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
} from "react-native";

// import styles
import * as style from "../../../styles";

//#region import SVGs
import SVG_Live from "../../../assets/svg/Live";
import SVG_Pin from "../../../assets/svg/Pin3.0";
import SVG_Return from "../../../assets/svg/Return";
import SVG_Translate from "../../../assets/svg/Translate";
//#endregion

//#region import Components
import Map from "../../event/Map";
import JoinButton from "./JoinButton";

import { LinearGradient } from "expo-linear-gradient";
//#endregion

//#region import Constants
import { convertTimestampToString } from "../../../constants/time";
import { checkIfClientIsInEvent, checkIfLive } from "../../../constants/event";
import { getUnsignedTranslationText } from "../../../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
} from "../../../constants/content";
import { checkLinkedUser } from "../../../constants/content/linking";
//#endregion

export default function EventWithAdBannerCard({ event, creator, onPress }) {
    const mapRef = useRef();

    return (
        <Pressable style={[styles.container, style.oHidden]} onPress={onPress}>
            {/* Info  */}
            <View style={[styles.infoBoxContainer, style.oVisible, styles.shadowBlack]}>
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
                    style={[styles.infoContainer, style.Pmd, style.oHidden]}>
                    {/* Event Title */}
                    <Text numberOfLines={2} style={[style.TlgBd, style.tWhite]}>
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
                        <Text style={[style.tWhite, style.TlgRg]}>
                            {convertTimestampToString(event.starting)}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
            {/* Map */}
            <View style={[styles.mapBoxContainer, style.oVisible, styles.shadowBlue]}>
                <View style={[styles.mapInner, style.oHidden]}>
                <Map
                    style={style.allMax}
                    accessible={false}
                    initialRegion={event.geoCords}
                    title={event.title}
                    mapRef={mapRef}
                    marker
                    onPress={onPress}
                    align={0}
                />
                </View>
            </View>
            {/* Ad Banner */}
            <View
                style={[
                    styles.adBannerBoxContainer,
                    style.oVisible,
                    styles.shadowBlack
                ]}>
                    <View style={[styles.adBannerInner, style.oHidden, { aspectRatio: event.eventOptions.adBanner.aspect },]}>
                <Image
                    style={style.allMax}
                    resizeMode="cover"
                    source={{
                        uri: event.eventOptions.adBanner.uri,
                    }}
                />
            </View>
            {/* Join Button */}
            {/* <View style={[styles.joinButtonBoxContainer]}>
                <JoinButton
                    onPress={onPress}
                    checked={checkIfClientIsInEvent(event.checks)}
                />
            </View> */}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 1,
        position: "relative",
        aspectRatio: 1,
    },

    infoBoxContainer: {
        position: "absolute",
        width: "75%",
        top: 0,
        left: "10%",

        borderRadius: 10,
        zIndex: 4,
    },
    infoContainer: {
        width: "100%",
        flexDirection: "column",
        borderRadius: 10
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

    shadowBlack: {
        // Shadow
        shadowRadius: 25,
        shadowOpacity: 1,
        shadowColor: style.colors.black,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        backgroundColor: style.colors.black,
    },

    mapBoxContainer: {
        position: "absolute",
        width: "60%",
        aspectRatio: 1,
        left: 0,
        top: "15%",

        borderRadius: 10,
        zIndex: 2,
    },
    mapInner: {
        borderRadius: 10,
    },
    shadowBlue: {
        // Shadow
        shadowRadius: 10,
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

    adBannerBoxContainer: {
        position: "absolute",
        zIndex: 3,
        height: "60%",
        maxWidth: Dimensions.get("screen").width * 0.5,
        right: 0,
        bottom: 0,

        borderRadius: 10,
    },
    adBannerInner: {
        borderRadius: 10
    },

    joinButtonBoxContainer: {
        position: "absolute",
        bottom: 0,
        right: "10%",
        zIndex: 5,
    },
});
