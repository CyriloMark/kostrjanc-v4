import React, { useState, useEffect, useRef } from "react";

import { Pressable, View, StyleSheet, Text, Image } from "react-native";

import { getDatabase, ref, get, child } from "firebase/database";

import * as style from "../../styles";

import { Event_Placeholder } from "../../constants/content/PlaceholderData";

import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";

import SVG_Live from "../../assets/svg/Live";
import SVG_Pin from "../../assets/svg/Pin3.0";

import { checkIfLive, mapStylesDefault } from "../../constants/event";
import { convertTimestampToString } from "../../constants/time";
import { getData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import { getUnsignedTranslationText } from "../../constants/content/translation";
import { checkForUnnecessaryNewLine } from "../../constants/content";
import { checkLinkedUser } from "../../constants/content/linking";

export default function Event(props) {
    const mapRef = useRef();
    const [event, setEvent] = useState(Event_Placeholder);
    const [isLive, setIsLive] = useState(false);
    const [imgUris, setImgUris] = useState([]);

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

                mapRef.current.animateToRegion(eventData["geoCords"], 0);

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
                getChecksUris(
                    eventSnap.hasChild("checks") ? eventData["checks"] : []
                );
            })
            .catch(error =>
                console.log("cards/Event.jsx", "get event", error.code)
            );
    };

    let getChecksUris = async d => {
        if (d.length === 0) return;
        const IMG_Amt = 5;

        let uriList = [];

        const userData = await getData("userData");
        const followeringList = [
            ...(userData.follower ? userData.follower : []),
            ...(userData.following ? userData.following : []),
        ];
        const userFilteredList = followeringList
            .filter(function (item, pos) {
                return followeringList.indexOf(item) == pos;
            })
            .filter(function (item) {
                return d.includes(item);
            })
            .slice(0, IMG_Amt);

        const db = getDatabase();
        for (let i = 0; i < userFilteredList.length; i++) {
            get(child(ref(db), `users/${userFilteredList[i]}/pbUri`))
                .then(pbSnap => {
                    uriList.push(pbSnap.val());
                })
                .finally(() => {
                    if (userFilteredList.length - 1 === i) setImgUris(uriList);
                })
                .catch(error =>
                    console.log(
                        "error comps/cards/Event.jsx",
                        "getChecksUris getPbs",
                        error.code
                    )
                );
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!props.group && event.group) return null;
    if (event.isBanned) return null;
    return (
        <View
            style={[
                props.style,
                { marginVertical: style.defaultMmd, zIndex: 10 },
            ]}>
            <Pressable style={styles.container} onPress={props.onPress}>
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
                        {checkLinkedUser(
                            getUnsignedTranslationText(
                                checkForUnnecessaryNewLine(event.title)
                            )
                        ).map((el, key) => (
                            <Text
                                key={key}
                                // numberOfLines={1}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                    style.TlgRg,
                                    style.tWhite,
                                    style.oHidden,
                                ]}>
                                {el.text}
                            </Text>
                        ))}
                        <Text
                            style={[
                                style.TsmLt,
                                style.tWhite,
                                { marginTop: style.defaultMsm },
                            ]}>
                            {convertTimestampToString(event.starting) +
                                " - " +
                                convertTimestampToString(event.ending)}
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
                        ref={mapRef}
                        style={style.allMax}
                        accessible={false}
                        userInterfaceStyle="dark"
                        focusable={false}
                        rotateEnabled={false}
                        provider={PROVIDER_DEFAULT}
                        customMapStyle={mapStylesDefault}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        scrollEnabled={false}
                        initialRegion={event.geoCords}
                        onPress={props.onPress}>
                        <Marker
                            coordinate={event.geoCords}
                            draggable={false}
                            style={{ transform: [{ translateY: -16 }] }}
                            tappable={false}>
                            <SVG_Pin
                                fill={style.colors.red}
                                style={styles.marker}
                            />
                        </Marker>
                    </MapView>
                </View>

                {/* Checks PBs */}
                {imgUris.length > 0 ? (
                    <View style={[styles.checksContainer]}>
                        <Text style={[style.TsmRg, style.tWhite]}>
                            {getLangs("event_checkshint")}
                        </Text>
                        <View style={[styles.checksImgContainer]}>
                            {imgUris.map((el, key) => (
                                <Image
                                    key={key}
                                    resizeMode="cover"
                                    source={{ uri: el }}
                                    style={[
                                        styles.checksImg,
                                        style.allMax,
                                        key === 0
                                            ? null
                                            : {
                                                  marginLeft:
                                                      -style.defaultMmd * 2,
                                              },
                                        {
                                            zIndex: 10 - key,
                                            opacity: 1 - parseFloat(`.${key}`),
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                ) : null}
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
        minWidth: 24,
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
        flexDirection: "column",
        marginTop: style.defaultMsm,
        // justifyContent: "center",
    },
    checksImgContainer: {
        marginTop: style.defaultMsm,
        flexDirection: "row",
    },
    checksImg: {
        aspectRatio: 1,
        maxHeight: 32,
        maxWidth: 32,
        borderRadius: 100,
    },

    marker: {
        zIndex: 99,
        height: 32,
        width: 32,
        ...style.boxShadow,
    },
});
