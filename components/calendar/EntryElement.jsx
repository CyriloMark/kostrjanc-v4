import React from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";

import * as s from "../../styles";

//#region import Constants
import { convertTimestampToDateText } from "../../constants/time";
import { checkLinkedUser } from "../../constants/content/linking";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
} from "../../constants/content";
import { checkIfEventIsLongerThanADay } from "../../constants/event";

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
export default function ({ style, onPress, id, eventData }) {
    return (
        <View style={[styles.elementContainer, style, s.pH]}>
            {/* Line */}
            <View style={[styles.elementLineContainer, s.allCenter]}>
                {/* Circle */}
                <View style={styles.circle} />
                <View style={styles.line} />
            </View>

            <View style={[styles.elementInfoContainer]}>
                <Text
                    style={[
                        s.tBlue,
                        s.Tmd,
                        styles.dateText,
                        { fontFamily: "Barlow_Bold" },
                    ]}>
                    {convertTimestampToDateText(eventData.starting)}
                </Text>

                <Text style={[s.TlgBd, s.tWhite, { marginTop: s.defaultMsm }]}>
                    {checkLinkedUser(
                        getUnsignedTranslationText(
                            checkForUnnecessaryNewLine(eventData.title)
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
                                            s.tBlue,
                                            {
                                                textDecorationLine: "underline",
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
        width: 2,
        backgroundColor: s.colors.blue,
    },

    elementInfoContainer: {
        flex: 1,
        paddingLeft: 6,
        paddingBottom: s.defaultMlg,
        flexDirection: "column",
    },
    dateText: {
        lineHeight: 26,
    },
});
