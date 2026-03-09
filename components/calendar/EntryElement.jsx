import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";

import * as s from "../../styles";

import { getAuth } from "firebase/auth";

import { LinearGradient } from "expo-linear-gradient";

//#region import Constants
import { convertTimestampToDateText } from "../../constants/time";
import { checkLinkedUser } from "../../constants/content/linking";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
} from "../../constants/content";
import {
    checkIfEventIsLongerThanADay,
    Event_Tags,
} from "../../constants/event";
import { getLangs } from "../../constants/langs";
import { loadEventCreatorName } from "../../constants/calendar/events";

//#region import Compontent
import Map from "../event/Map";
import Tag from "../event/Tag";

//#region import SVGs
import SVG_Live from "../../assets/svg/Live";
import CheckButton from "../event/CheckButton";
import JoinButton from "../content/variableEventCard/JoinButton";
import ListButton from "../event/ListButton";

/**
 *
 * @param {Object} param0
 * @param {Object} param0.style
 * @param {function} param0.onPress
 * @param {number} param0.id
 * @param {Object} param0.eventData
 * @param {number} param0.eventData.id
 * @param {number} param0.eventData.starting
 * @param {number} param0.eventData.ending
 * @param {string} param0.eventData.title
 * @param {string} param0.eventData.description
 * @param {Array<string>} param0.eventData.checks
 * @returns
 */
export default function EntryElement({ style, onPress, id, eventData }) {
    const [isLive, setIsLive] = useState(false);
    const [creatorName, setCreatorName] = useState("");

    useEffect(() => {
        const now = Date.now();
        setIsLive(eventData.starting < now && eventData.ending < now);

        loadEventCreatorName(eventData.creator).then(data =>
            setCreatorName(data),
        );
    }, []);

    return (
        <View style={[styles.elementContainer, style, s.pH]}>
            {
                //#region Left Line
            }
            <View style={[styles.elementLineContainer, s.allCenter]}>
                <View style={styles.lineSec} />
                <View style={styles.circle} />
                <View style={styles.line} />
                <View style={styles.circle} />
                <View style={styles.lineSec} />
            </View>

            <View style={[styles.elementInfoContainer]}>
                {
                    //#region Starting Time
                }
                <Text
                    style={[
                        s.tBlue,
                        s.Tmd,
                        styles.dateText,
                        { fontFamily: "Barlow_Bold" },
                    ]}>
                    {convertTimestampToDateText(eventData.starting)}
                </Text>

                {
                    //#region  Event Creator
                }
                <View style={{ marginTop: s.defaultMmd }}>
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
                        <Text style={[s.TsmRg, s.tWhite]}>{creatorName}</Text>
                    </LinearGradient>
                </View>

                {
                    //#region Title Container
                }
                <View style={styles.titleContainer}>
                    <Text style={[s.TlgBd, s.tWhite]}>
                        {/* Live */}
                        {isLive ? (
                            <View style={styles.liveContainer}>
                                <SVG_Live
                                    style={s.allMax}
                                    fill={s.colors.red}
                                />
                            </View>
                        ) : null}
                        <Text style={[s.TlgBd, s.tWhite]}>{"  "}</Text>
                        {checkLinkedUser(
                            getUnsignedTranslationText(
                                checkForUnnecessaryNewLine(eventData.title),
                            ),
                        ).map((el, key) => (
                            <Text key={key} style={[s.TlgBd, s.tWhite]}>
                                {el.text}
                            </Text>
                        ))}
                    </Text>
                </View>

                {
                    //#region Map Container
                }
                <View style={[styles.mapContainer, s.allCenter, s.oHidden]}>
                    <Map
                        style={s.allMax}
                        accessible={false}
                        initialRegion={eventData.geoCords}
                        onPress={onPress}
                        title={eventData.title}
                        marker={true}
                    />
                </View>

                {
                    //#region Tags Container
                }
                {eventData.eventOptions?.tags ? (
                    <View style={styles.tagsContainer}>
                        {eventData.eventOptions.tags.map((tag, key) => (
                            <Tag
                                key={key}
                                style={{
                                    margin: 2,
                                }}
                                title={getLangs(Event_Tags[tag])}
                            />
                        ))}
                    </View>
                ) : null}

                {
                    //#region Interaction Contaienr
                }
                <View style={styles.interactionContainer}>
                    {eventData.checks ? (
                        <ListButton
                            title={eventData.checks?.length}
                            style={{ marginRight: s.defaultMsm }}
                            onPress={() => {}}
                        />
                    ) : null}
                    <JoinButton
                        checked={eventData.checks?.includes(
                            getAuth().currentUser.uid,
                        )}
                        onPress={onPress}
                    />
                </View>

                {
                    //#region End Time
                }
                <Text
                    style={[
                        s.tBlue,
                        s.Tmd,
                        styles.dateText,
                        { fontFamily: "Barlow_Bold", marginTop: s.defaultMlg },
                    ]}>
                    {convertTimestampToDateText(eventData.ending)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    elementContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "stretch",
    },
    elementLineContainer: {
        flexDirection: "column",
        width: 32,
    },
    circle: {
        width: 26,
        height: 26,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: s.colors.blue,
    },
    line: {
        flex: 1,
        width: 5,
        backgroundColor: s.colors.blue,
    },
    lineSec: {
        height: s.defaultMlg,
        width: 2,
        backgroundColor: s.colors.sec,
    },

    elementInfoContainer: {
        flex: 1,
        marginTop: s.defaultMlg,
        paddingLeft: 6,
        paddingBottom: s.defaultMlg,

        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    dateText: {
        lineHeight: 26,
    },

    creatorContainer: {
        borderRadius: 5,
    },

    titleContainer: {
        marginTop: s.defaultMsm,
        flexDirection: "row",
    },
    liveContainer: {
        // aspectRatio: 1.4,
        width: 28,
        height: 20,
        justifyContent: "center",
        borderRadius: 100,
        overflow: "hidden",
        transform: [
            {
                translateY: 2,
            },
        ],
    },

    mapContainer: {
        width: "100%",
        aspectRatio: 2,
        borderRadius: 10,
        marginTop: s.defaultMsm,
    },

    tagsContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: s.defaultMmd,
    },

    interactionContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: s.defaultMmd,
    },
});
