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

export default function EventElement({ event, creator, onPress }) {
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
                align={1}
            />

            {
                //#region Content Container
            }
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
                    style={[style.allMax, styles.contentInnerContainer]}>
                    {
                        //#region Event Text Container
                    }
                    <View style={[styles.contentTextContainer]}>
                        {
                            //#region Event Creator
                        }
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
                            style={[styles.creatorContainer, style.Psm]}>
                            <Text style={[style.TsmRg, style.tWhite]}>
                                {creator.name}
                            </Text>
                        </LinearGradient>

                        {
                            //#region Event Title
                        }
                        <Text
                            numberOfLines={2}
                            style={[
                                style.tWhite,
                                style.TlgBd,
                                { marginTop: style.defaultMsm },
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
                            <Text
                                style={[
                                    style.tWhite,
                                    style.Tmd,
                                    // {
                                    //     fontFamily: "Barlow_Bold",
                                    // },
                                ]}>
                                {convertTimestampToString(event.starting)}
                            </Text>
                        </View>
                    </View>

                    {
                        //#region Event Ad Banner Container
                    }
                    <View
                        style={[
                            styles.contentImgContainer,
                            style.allCenter,
                            style.oVisible,
                        ]}>
                        <Image
                            style={[
                                styles.image,
                                // style.allMax,
                                {
                                    aspectRatio:
                                        event.eventOptions.adBanner.aspect,
                                },
                            ]}
                            resizeMode="contain"
                            source={{
                                uri: event.eventOptions.adBanner.uri,
                            }}
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
        height: Math.min(Dimensions.get("screen").height / 5, 256),
        borderRadius: 9,
        flexDirection: "row",
        zIndex: 3,
    },

    contentContainer: {
        flex: 1,
        position: "absolute",
    },
    contentInnerContainer: {
        flexDirection: "row",
        padding: style.Plg.paddingVertical,
    },
    contentTextContainer: {
        width: "60%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    contentImgContainer: {
        width: "40%",
        height: "100%",

        shadowColor: style.colors.black,
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    image: {
        width: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        borderRadius: 10,
    },

    creatorContainer: {
        borderRadius: 5,
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
