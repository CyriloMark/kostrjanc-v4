import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as s from "../../styles";

import MapView, { Marker } from "react-native-maps";

import { Event_Placeholder } from "../../constants/content/PlaceholderData";

export default function Event({ id, onPress, style, asCard }) {
    const [event, setEvent] = useState(Event_Placeholder);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "events/" + id))
            .then(eventSnap => {
                if (!eventSnap.exists()) {
                    setEvent(Event_Placeholder);
                    return;
                }
                const eventData = eventSnap.val();

                if (eventSnap.hasChild("isBanned")) {
                    if (eventData["isBanned"]) {
                        setEvent({
                            ...Event_Placeholder,
                            isBanned: true,
                        });
                        return;
                    }
                }

                setEvent(eventData);
            })
            .catch(error =>
                console.log("content/Event.jsx", "get event", error.code)
            );
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={style}>
            <Pressable style={styles.container} onPress={onPress}>
                {/* Map */}
                <View style={[styles.mapContainer, s.allCenter, s.oHidden]}>
                    <MapView
                        style={s.allMax}
                        accessible={false}
                        focusable={false}
                        rotateEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        initialRegion={event.geoCords}
                        scrollEnabled={false}
                        userInterfaceStyle="dark"
                        onPress={onPress}>
                        <Marker coordinate={event.geoCords} />
                    </MapView>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
    },

    mapContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
        marginTop: s.defaultMsm,
    },
});
