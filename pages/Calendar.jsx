import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";

import * as style from "../styles";

//#region import Constants
import { getEvents } from "../constants/calendar/calendarpage";

//#region import Components
import BackHeader from "../components/BackHeader";
import EntryElement from "../components/calendar/EntryElement";

export default function Calendar({ navigation, route }) {
    const scrollRef = useRef();

    const { month } = route.params;

    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents().then(events => setEvents(events));
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() =>
                    scrollRef.current.scrollTo({
                        y: 0,
                        animated: true,
                    })
                }>
                <BackHeader
                    onBack={() => navigation.goBack()}
                    title={""}
                    showReload={false}
                />
            </Pressable>

            <ScrollView
                scrollEnabled
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                keyboardDismissMode="interactive"
                snapToAlignment="center"
                snapToEnd
                keyboardShouldPersistTaps="handled"
                ref={scrollRef}
                style={[style.container, style.pH, style.oVisible]}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}>
                <Text
                    style={[
                        style.tWhite,
                        style.Ttitle2,
                        { marginBottom: style.defaultMmd },
                    ]}>
                    kostrjanc protyka
                </Text>

                {events.map((event, key) => (
                    <EntryElement
                        key={key}
                        eventData={event}
                        id={event.id}
                        onPress={() =>
                            navigation.navigate("eventView", { id: id })
                        }
                    />
                ))}
            </ScrollView>
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
        borderColor: style.colors.blue,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: style.colors.blue,
    },

    elementInfoContainer: {
        flex: 1,
        paddingLeft: 6,
        paddingBottom: style.defaultMlg,
        flexDirection: "column",
    },
    dateText: {
        lineHeight: 26,
    },
});
