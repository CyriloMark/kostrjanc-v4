import React, { useState, useEffect } from "react";

import { Pressable, View, StyleSheet, Text, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import { Event_Placeholder } from "../../constants/content/PlaceholderData";

import MapView, { Marker } from "react-native-maps";

import SVG_Live from "../../assets/svg/Live";

import { checkIfLive } from "../../constants/event";
import { convertTimestampToString } from "../../constants/time";

export default function Event(props) {
    const [event, setEvent] = useState(Event_Placeholder);
    const [isLive, setIsLive] = useState(false);
    const [imgUris, setImgUris] = useState(null);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "events/" + props.id))
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

                setEvent({
                    ...eventData,
                    checks: eventSnap.hasChild("checks")
                        ? eventData["checks"]
                        : [],
                    isBanned: false,
                });
                setIsLive(
                    checkIfLive(eventData["starting"], eventData["ending"])
                );
                // getChecksUris(
                //     eventSnap.hasChild("checks") ? eventData["checks"] : []
                // );
            })
            .catch(error =>
                console.log("cards/Event.jsx", "get event", error.code)
            );
    };

    let getChecksUris = d => {
        setImgUris([
            "https://www.colorhexa.com/587db0.png",
            "https://www.colorhexa.com/587db0.png",
            "https://www.colorhexa.com/587db0.png",
        ]);
        return;
        // Wenn login drin ist
        const IMGamt = 3;

        let finalList = [];
        let uriList = [];

        const db = getDatabase();
        get(child(ref(db), "users/" + getAuth().currentUser.uid + "/following"))
            .then(snapshot => {
                if (snapshot.exists()) {
                    const ids = snapshot.val();
                    d.forEach(el => {
                        if (ids.includes(el)) finalList.push(el);
                    });
                }
            })
            .finally(() => {
                get(
                    child(
                        ref(db),
                        "users/" + getAuth().currentUser.uid + "/follower"
                    )
                )
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            const ids = snapshot.val();
                            d.forEach(el => {
                                if (ids.includes(el) && !finalList.includes(el))
                                    finalList.push(el);
                            });
                        }
                    })
                    .finally(() => {
                        if (finalList.length > IMGamt) {
                            finalList.splice(
                                IMGamt - 1,
                                finalList.length - IMGamt
                            );
                        } else if (
                            finalList.length < IMGamt &&
                            d.length >= IMGamt
                        ) {
                            let otherChecks = d.filter(
                                i => !finalList.includes(i)
                            );
                            for (let i = 0; i < IMGamt - finalList.length; i++)
                                finalList.push(otherChecks[i]);
                        } else if (
                            finalList.length < IMGamt &&
                            d.length <= IMGamt
                        ) {
                            let otherChecks = d.filter(
                                i => !finalList.includes(i)
                            );
                            otherChecks.forEach(a => finalList.push(a));
                        }

                        for (let i = 0; i < finalList.length; i++) {
                            get(
                                child(
                                    ref(db),
                                    "users/" + finalList[i] + "/pbUri"
                                )
                            )
                                .then(snap => {
                                    uriList.push(snap.val());
                                })
                                .finally(() => {
                                    if (finalList.length - 1 === i)
                                        setImgUris(uriList);
                                })
                                .catch(error =>
                                    console.log(
                                        "error EventCard getUsersPBUri",
                                        error.code
                                    )
                                );
                        }
                    });
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={props.style}>
            <Pressable style={styles.container}>
                {/* Header */}
                <View style={[styles.headerContainer]}>
                    {/* Live */}
                    {isLive ? (
                        <View style={styles.headerLiveContainer}>
                            <SVG_Live
                                style={styles.headerLive}
                                fill={style.colors.red}
                            />
                        </View>
                    ) : null}
                    <View style={styles.titleContainer}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[style.TlgRg, style.tWhite]}>
                            {event.title}
                        </Text>
                        <Text
                            style={[
                                style.TsmLt,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {convertTimestampToString(event.starting)}
                        </Text>
                    </View>
                </View>
                {/* Map */}
                <View
                    style={[
                        styles.mapContainer,
                        style.allCenter,
                        style.oHidden,
                    ]}>
                    <MapView
                        style={style.allMax}
                        accessible={false}
                        focusable={false}
                        rotateEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        initialRegion={event.geoCords}
                        scrollEnabled={false}
                        onPress={props.onPress}>
                        <Marker coordinate={event.geoCords} />
                    </MapView>
                </View>

                {/* Checks PBs */}
                <View style={[styles.checksContainer]}>
                    {imgUris
                        ? imgUris.map((el, key) => (
                              <Image
                                  key={key}
                                  resizeMode="cover"
                                  source={{ uri: el }}
                                  style={[
                                      styles.checksImg,
                                      style.allMax,
                                      style.boxShadow,
                                      key === 0
                                          ? null
                                          : {
                                                marginLeft:
                                                    -style.defaultMmd * 2,
                                            },
                                      {
                                          zIndex: 10 - key,
                                          opacity:
                                              1 - parseFloat("." + key * 2),
                                      },
                                  ]}
                              />
                          ))
                        : null}
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

    headerContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    headerLiveContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        justifyContent: "center",
        borderRadius: 100,
        overflow: "hidden",
        marginRight: style.defaultMmd,
    },
    headerLive: {
        width: "100%",
        height: "100%",
    },
    titleContainer: {
        flexDirection: "column",
    },

    mapContainer: {
        width: "100%",
        aspectRatio: 2,
        borderRadius: 10,
        marginTop: style.defaultMsm,
    },

    checksContainer: {
        width: "100%",
        flexDirection: "row",
        marginTop: style.defaultMsm,
    },
    checksImg: {
        aspectRatio: 1,
        maxHeight: 32,
        maxWidth: 32,
        borderRadius: 100,
    },
});
