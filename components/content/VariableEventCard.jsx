import React, { useEffect, useState } from "react";

import { View, StyleSheet } from "react-native";

import * as s from "../../styles";

//#region import Components & Constants
import BigCard from "./variableEventCard/BigCard";
import MediumCard from "./variableEventCard/MediumCard";
import EventWithAdBannerCard from "./variableEventCard/EventWithAdBannerCard";
import SmallCard from "./variableEventCard/SmallCard";

import {
    User_Placeholder,
    Event_Placeholder,
} from "../../constants/content/PlaceholderData";
import { checkIfEventHasBanner } from "../../constants/event";
//#endregion

import { get, child, ref, getDatabase } from "firebase/database";

export default function VariableEventCard({ style, size, data, onPress }) {
    const [creator, setCreator] = useState(User_Placeholder);
    const [event, setEvent] = useState(Event_Placeholder);

    //#region Load Data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), `events/${data.id}`))
            .then(eventSnap => {
                if (!eventSnap.exists()) return;
                const eventData = eventSnap.val();
                setEvent(eventData);

                get(child(ref(db), `users/${data.creator}`))
                    .then(userSnap => {
                        if (!userSnap.exists()) return;
                        const userData = userSnap.val();
                        setCreator(userData);
                    })
                    .catch(error =>
                        console.log(
                            "error components/content/VariableEventCard.jsx",
                            "get user Data",
                            error.code
                        )
                    );
            })
            .catch(error =>
                console.log(
                    "error components/content/VariableEventCard.jsx",
                    "get events Data",
                    error.code
                )
            );
    };
    //#endregion

    if (event.isBanned) return null;
    if (event.geoCords.latitude === Event_Placeholder.geoCords.latitude)
        return null;

    if (checkIfEventHasBanner(event))
        return (
            <View style={[style /*styles.shadow*/]}>
                <EventWithAdBannerCard
                    creator={creator}
                    event={event}
                    onPress={onPress}
                />
            </View>
        );

    return (
        <View style={[style, styles.shadow, styles.border]}>
            {size === 0 ? (
                <BigCard creator={creator} event={event} onPress={onPress} />
            ) : size === 1 ? (
                <MediumCard creator={creator} event={event} onPress={onPress} />
            ) : size === 2 ? (
                <SmallCard event={event} onPress={onPress} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        overflow: "visible",

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
        backgroundColor: s.colors.black,
    },
    border: {
        borderRadius: 10,
        borderColor: s.colors.sec,
        borderWidth: 1,
    },
});
