import React, { useEffect, useRef, useState } from "react";

import { Pressable, View, StyleSheet, Text, Image } from "react-native";

// import styles
import * as style from "../../../styles";

//#region import SVGs
import SVG_Live from "../../../assets/svg/Live";
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

export default function BigCard({ event, creator, onPress }) {
    const mapRef = useRef();

    return (
        <Pressable style={[styles.container, style.oHidden]} onPress={onPress}>
            <Map
                style={style.allMax}
                accessible={false}
                initialRegion={event.geoCords}
                title={event.title}
                mapRef={mapRef}
                marker
                onPress={onPress}
                align={0.5}
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
                    <View style={styles.contentInnerContainer}>
                        {
                            //#region Creator
                        }
                        <View
                            style={[
                                styles.creatorContainer,
                                { marginBottom: style.defaultMsm },
                            ]}>
                            <View
                                style={[
                                    styles.creatorImgContainer,
                                    style.oHidden,
                                ]}>
                                <Image
                                    source={{
                                        uri: creator.pbUri,
                                    }}
                                    style={style.allMax}
                                    resizeMode="cover"
                                    resizeMethod="auto"
                                />
                            </View>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.Tmd,
                                    {
                                        fontFamily: "Barlow_Bold",
                                        marginLeft: style.defaultMsm,
                                    },
                                ]}>
                                {creator.name}
                            </Text>
                        </View>
                        {
                            //#region Event Title
                        }
                        <Text
                            numberOfLines={3}
                            style={[
                                style.Ttitle2,
                                style.tWhite,
                                { marginTop: style.defaultMmd },
                            ]}>
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

                        {
                            //#region Event Time Starting
                        }
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

                        <JoinButton
                            onPress={onPress}
                            checked={checkIfClientIsInEvent(event.checks)}
                            style={{ marginTop: style.defaultMlg }}
                        />
                    </View>
                </LinearGradient>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 5 / 4,
        borderRadius: 10,
        zIndex: 3,
    },

    contentContainer: {
        flex: 1,
        position: "absolute",
    },
    contentInnerContainer: {
        width: "80%",
        height: "100%",
        padding: style.Plg.paddingVertical,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },

    creatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    creatorImgContainer: {
        borderRadius: 100,
        width: 26,
        aspectRatio: 1,
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
