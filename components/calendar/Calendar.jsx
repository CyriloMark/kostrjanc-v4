import React, { useEffect, useState } from "react";
import {
    Pressable,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Text,
} from "react-native";

import * as s from "../../styles";

//#region import Constants
import {
    DEFAULT_MONTH_TO_SCROLL_COUNT,
    DEFAULT_HEIGHT,
    generateMonthDatas,
} from "../../constants/calendar";
import { getFutureEventsByMonth } from "../../constants/calendar/events";

//#region import Components
import MonthCard from "./MonthCard";

export default function Calendar({ style, onPress }) {
    const monthData = generateMonthDatas(DEFAULT_MONTH_TO_SCROLL_COUNT);

    const [eventData, setEventData] = useState([]);

    const loadEvents = async () => {
        const ev = await getFutureEventsByMonth();
        setEventData(ev);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <View style={[style, styles.shadow, s.oVisible]}>
            <Pressable style={[styles.container, s.oHidden]} onPress={onPress}>
                <ScrollView
                    style={s.oVisible}
                    scrollEnabled
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    decelerationRate={"fast"}
                    snapToAlignment="start"
                    snapToInterval={DEFAULT_HEIGHT + s.defaultMlg * 2}>
                    {monthData.map((month, key) => (
                        <MonthCard
                            key={key}
                            style={{
                                marginTop: key !== 0 ? s.defaultMlg * 2 : 0,
                            }}
                            month={month}
                            directions={{
                                top: key !== 0,
                                bottom:
                                    key !== DEFAULT_MONTH_TO_SCROLL_COUNT - 1,
                            }}
                            relevantEvents={eventData.filter(
                                d =>
                                    d.month == month.month &&
                                    d.year == month.year
                            )}
                        />
                    ))}
                </ScrollView>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        // alignSelf: "center",
        // width: "100%",
        // // Shadow
        // shadowRadius: 15,
        // shadowOpacity: 0.5,
        // shadowColor: s.colors.sec,
        // shadowOffset: {
        //     width: 0,
        //     height: -2,
        // },
        // borderRadius: 10,
        // backgroundColor: s.colors.black,
        // borderColor: s.colors.sec,
        // borderWidth: 1,
    },
    container: {
        width: "100%",
        height: DEFAULT_HEIGHT,
        borderRadius: 10,
        zIndex: 3,
    },
});
