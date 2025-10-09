import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";

import * as s from "../../styles";

//#region import Constants
import {
    buildMonthStructure,
    DEFAULT_HEIGHT,
    getCurrentDateInfo,
} from "../../constants/calendar";
import { getLangs } from "../../constants/langs";
import { translateRelevantEventsToColor } from "../../constants/calendar/events";

//#region import Components
import BlueDateCell from "./BlueDateCell";
import RedDateCell from "./RedDateCell";
import EmptyDateCell from "./EmptyDateCell";
import DefaultDateCell from "./DefaultDateCell";

//#region import SVGs
import SVG_Event from "../../assets/svg/Event";
import SVG_Return from "../../assets/svg/Return";

export default function MonthCard({
    style,
    month,
    onPress,
    relevantEvents,
    directions,
}) {
    const [monthStructure, setMonthStructure] = useState([[]]);

    useEffect(() => {
        // console.log("uE", month.month, month.year);
        setMonthStructure(
            buildMonthStructure(
                month,
                translateRelevantEventsToColor(relevantEvents)
            )
        );
    }, [relevantEvents]);

    // const monthStructure = buildMonthStructure(month, colors);
    const isCurrentMonth = getCurrentDateInfo().month === month.month;

    return (
        <Pressable style={[style, styles.container]} onPress={onPress}>
            {
                //#region Header Container
            }
            <View style={[styles.headerContainer, s.allCenter, s.Pmd]}>
                <SVG_Event style={styles.icon} fill={s.colors.white} />
                <Text
                    style={[
                        s.tWhite,
                        s.Tmd,
                        {
                            fontFamily: "Barlow_Bold",
                            marginLeft: s.defaultMsm,
                        },
                    ]}>
                    {month.year}
                    {", "}
                    {getLangs(`calendar_months_${month.month}`)}{" "}
                    <Text style={s.Tmd}>{`(${getLangs(
                        `calendar_months_alt_${month.month}`
                    )})`}</Text>
                </Text>
            </View>

            {
                //#region Content Container
            }
            <View style={[styles.contentContainer, s.allCenter]}>
                {monthStructure.map((week, weekKey) => (
                    //#region Week Row
                    <View key={weekKey} style={[styles.weekContainer]}>
                        {week.map((day, dayKey) =>
                            //#region Day Cell
                            day.date ? (
                                day.type === 1 ? (
                                    <BlueDateCell
                                        key={dayKey}
                                        onPress={onPress}
                                        text={day.date}
                                        style={[
                                            styles.dateContainer,
                                            isCurrentMonth &&
                                            day.date == month.day
                                                ? styles.today
                                                : null,
                                            {
                                                opacity:
                                                    isCurrentMonth &&
                                                    day.date < month.day
                                                        ? 0.5
                                                        : 1,
                                            },
                                        ]}
                                    />
                                ) : day.type === 2 ? (
                                    <RedDateCell
                                        key={dayKey}
                                        onPress={onPress}
                                        text={day.date}
                                        style={[
                                            styles.dateContainer,
                                            isCurrentMonth &&
                                            day.date == month.day
                                                ? styles.today
                                                : null,
                                            {
                                                opacity:
                                                    isCurrentMonth &&
                                                    day.date < month.day
                                                        ? 0.5
                                                        : 1,
                                            },
                                        ]}
                                    />
                                ) : (
                                    <DefaultDateCell
                                        key={dayKey}
                                        onPress={onPress}
                                        text={day.date}
                                        style={[
                                            styles.dateContainer,
                                            isCurrentMonth &&
                                            day.date == month.day
                                                ? styles.today
                                                : null,
                                            {
                                                opacity:
                                                    isCurrentMonth &&
                                                    day.date < month.day
                                                        ? 0.5
                                                        : 1,
                                            },
                                        ]}
                                    />
                                )
                            ) : (
                                <EmptyDateCell
                                    key={dayKey}
                                    style={styles.dateContainer}
                                />
                            )
                        )}
                    </View>
                ))}
            </View>

            {
                //#region Arrows Up & Down
            }
            <View style={[styles.arrowContainer, s.Pmd]}>
                {directions.top ? (
                    <SVG_Return
                        style={styles.arrowIcon}
                        rotation={-90}
                        fill={s.colors.blue}
                    />
                ) : (
                    <View style={styles.arrowIcon} />
                )}
                {directions.bottom ? (
                    <SVG_Return
                        style={styles.arrowIcon}
                        rotation={90}
                        fill={s.colors.blue}
                    />
                ) : (
                    <View style={styles.arrowIcon} />
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: DEFAULT_HEIGHT,
        borderRadius: 10,
        flexDirection: "column",
    },

    headerContainer: {
        width: "100%",
        flexDirection: "row",
        // alignItems: "center",
    },
    icon: {
        aspectRatio: 1,
        width: 16,
        height: 16,
    },

    contentContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "column",

        paddingBottom: s.defaultMlg,
        // backgroundColor: "red",
    },
    weekContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: s.defaultMsm * 0.75,
    },
    dateContainer: {
        marginHorizontal: 0,
    },
    today: {
        borderWidth: 1,
        borderColor: s.colors.red,
        borderRadius: 100,
    },

    arrowContainer: {
        height: "100%",
        right: 0,
        bottom: 0,
        top: 0,
        position: "absolute",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    arrowIcon: {
        aspectRatio: 1,
        width: 16,
        height: 16,
    },
});
