import React, { useEffect, useRef, useState } from "react";

import { Pressable, View, StyleSheet, Text, Image } from "react-native";

// import styles
import * as s from "../../styles";

// import SVGs
import SVG_Live from "../../assets/svg/Live";
import SVG_Pin from "../../assets/svg/Pin3.0";
import SVG_Return from "../../assets/svg/Return";

// import Constants
import { checkIfLive, mapStylesDefault } from "../../constants/event";
import { Event_Placeholder } from "../../constants/content/PlaceholderData";
import {
    convertTimestampToDate,
    convertTimestampToString,
} from "../../constants/time";
import { getLangs } from "../../constants/langs";

import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";

import { get, child, ref, getDatabase } from "firebase/database";

export default function VariableEventCard({ style, size, data, onPress }) {
    const mapRef = useRef();

    const [event, setEvent] = useState({
        ...Event_Placeholder,
        creator: {
            id: "",
            pbUri: "https://www.colorhexa.com/587db0.png",
            name: "",
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), `events/${data.id}`))
            .then(eventSnap => {
                if (!eventSnap.exists()) return;
                const eventData = eventSnap.val();

                get(child(ref(db), `users/${data.creator}`))
                    .then(userSnap => {
                        if (!userSnap.exists()) return;
                        const userData = userSnap.val();

                        setEvent({
                            ...eventData,
                            creator: {
                                id: data.creator,
                                name: userData.name,
                                pbUri: userData.pbUri,
                            },
                        });

                        mapRef.current.animateToRegion(
                            eventData["geoCords"],
                            0
                        );
                    })
                    .catch(error =>
                        console.log(
                            "components/content/VariableEventCard.jsx",
                            "get user Data",
                            error.code
                        )
                    );
            })
            .catch(error =>
                console.log(
                    "components/content/VariableEventCard.jsx",
                    "get events Data",
                    error.code
                )
            );
    };

    //#region Size === 0 / Big Card
    if (size === 0)
        return (
            <View style={style}>
                <Pressable style={s.container} onPress={onPress}>
                    {/* Header */}
                    <View style={[styles_big.headerContainer, s.allCenter]}>
                        {/* Title */}
                        <Text style={[s.TlgBd, s.tWhite]}>{event.title}</Text>
                        {/* Creator Container */}
                        <View
                            style={[
                                styles_big.userContainer,
                                s.Psm,
                                s.allCenter,
                            ]}>
                            <View style={styles.userPbContainer}>
                                <Image
                                    source={{
                                        uri: event.creator.pbUri,
                                    }}
                                    style={styles.userPb}
                                    resizeMode="cover"
                                    resizeMethod="auto"
                                />
                            </View>
                            <Text
                                style={[
                                    s.Tmd,
                                    s.tWhite,
                                    {
                                        marginLeft: s.defaultMmd,
                                    },
                                ]}>
                                {event.creator.name}
                            </Text>
                        </View>
                        {/* Time Container */}
                        <View style={[styles_big.timeContainer, s.allCenter]}>
                            <Text style={[s.Tmd, s.tWhite]}>
                                {convertTimestampToString(event.starting)}
                            </Text>
                            <View style={s.pH}>
                                {checkIfLive(event.starting, event.ending) ? (
                                    <SVG_Live
                                        fill={s.colors.red}
                                        style={styles.liveIcon}
                                    />
                                ) : (
                                    <Text style={[s.Tmd, s.tWhite]}>-</Text>
                                )}
                            </View>
                            <Text style={[s.Tmd, s.tWhite]}>
                                {convertTimestampToString(event.ending)}
                            </Text>
                        </View>
                    </View>
                    {/* Map */}
                    <View
                        style={[
                            styles_big.mapContainer,
                            s.allCenter,
                            s.oHidden,
                        ]}>
                        <MapView
                            ref={mapRef}
                            style={s.allMax}
                            accessible
                            userInterfaceStyle="dark"
                            focusable={false}
                            rotateEnabled={false}
                            provider={PROVIDER_DEFAULT}
                            customMapStyle={mapStylesDefault}
                            zoomEnabled
                            pitchEnabled
                            scrollEnabled
                            initialRegion={event.geoCords}
                            onPress={onPress}>
                            <Marker
                                focusable
                                draggable={false}
                                title={event.title}
                                coordinate={event.geoCords}>
                                <SVG_Pin
                                    fill={s.colors.red}
                                    style={styles.marker}
                                />
                            </Marker>
                        </MapView>
                    </View>
                    {/* Checks */}
                    <View style={[styles_big.checkContainer]}>
                        <View style={styles_big.checksContainer}>
                            <Text style={[s.tWhite, s.Tmd]}>
                                {getLangs("event_contentcard_big_0")}
                                <Text style={s.TlgBd}>
                                    {event.checks ? event.checks.length : 0}
                                </Text>
                                {getLangs("event_contentcard_big_1")}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles_big.checkButton,
                                // s.Pmd,
                                s.allCenter,
                            ]}>
                            <LinearGradient
                                style={[
                                    s.allCenter,
                                    s.Pmd,
                                    styles_big.checkButtonInner,
                                ]}
                                colors={[s.colors.red, s.colors.white]}
                                end={{ x: 0.5, y: 2.5 }}
                                locations={[0, 0.75]}>
                                <Text
                                    style={[
                                        s.tBlack,
                                        s.Tmd,
                                        { marginRight: s.defaultMmd },
                                    ]}>
                                    {getLangs("checkbtn_check")}
                                </Text>
                                <View>
                                    <SVG_Return
                                        fill={s.colors.black}
                                        rotation={0}
                                        style={styles_big.checkButtonIcon}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    //#endregion
    //#region Size === 1 / Medium Card
    else if (size === 1)
        return (
            <View style={style}>
                <Pressable style={s.container} onPress={onPress}>
                    {/* Header */}
                    <View style={[styles_medium.headerContainer]}>
                        {/* Live */}
                        {checkIfLive(event.starting, event.ending) ? (
                            <View style={styles_medium.headerLiveContainer}>
                                <SVG_Live
                                    style={styles_medium.headerLive}
                                    fill={s.colors.red}
                                />
                            </View>
                        ) : null}
                        <View style={styles_medium.titleContainer}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={[s.TlgBd, s.tWhite]}>
                                {event.title}
                            </Text>

                            <View style={[styles.userContainer, s.Psm]}>
                                <View style={styles.userPbContainer}>
                                    <Image
                                        source={{
                                            uri: event.creator.pbUri,
                                        }}
                                        style={styles.userPb}
                                        resizeMode="cover"
                                        resizeMethod="auto"
                                    />
                                </View>
                                <Text
                                    style={[
                                        s.Tmd,
                                        s.tWhite,
                                        {
                                            marginLeft: s.defaultMmd,
                                        },
                                    ]}>
                                    {event.creator.name}
                                </Text>
                            </View>

                            <Text
                                style={[
                                    s.TsmLt,
                                    s.tWhite,
                                    { marginTop: s.defaultMsm },
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
                            styles_medium.mapContainer,
                            s.allCenter,
                            s.oHidden,
                        ]}>
                        <MapView
                            ref={mapRef}
                            style={s.allMax}
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
                            onPress={onPress}>
                            {/* <Marker
                            coordinate={event.geoCords}
                            draggable={false}
                            tappable={false}>
                            
                        </Marker> */}
                        </MapView>
                        <SVG_Pin fill={s.colors.red} style={styles.marker} />
                    </View>

                    {/* Checks */}
                    <View style={[styles_medium.checkContainer]}>
                        <View style={styles_medium.checksContainer}>
                            <Text style={[s.tWhite, s.Tmd]}>
                                {getLangs("event_contentcard_big_0")}
                                <Text style={s.TlgBd}>
                                    {event.checks ? event.checks.length : 0}
                                </Text>
                                {getLangs("event_contentcard_medium_0")}
                            </Text>
                        </View>
                        {/* Check Button */}
                        <View
                            style={[
                                styles_medium.checkButton,
                                s.allCenter,
                                s.oHidden,
                            ]}>
                            <LinearGradient
                                style={[
                                    s.allMax,
                                    s.allCenter,
                                    s.oHidden,
                                    { padding: s.Pmd.paddingHorizontal },
                                ]}
                                colors={[s.colors.red, s.colors.white]}
                                end={{ x: 0.5, y: 2.5 }}
                                locations={[0, 0.75]}>
                                <SVG_Return
                                    fill={s.colors.black}
                                    rotation={0}
                                    style={styles_medium.checkButtonIcon}
                                />
                            </LinearGradient>
                        </View>
                    </View>
                </Pressable>
            </View>
        );
    //#endregion
    //#region Size === 2 / Small Card
    else if (size === 2)
        return (
            <View style={style}>
                <Pressable
                    style={[s.container, s.allCenter, { flexDirection: "row" }]}
                    onPress={onPress}>
                    {/* Text Area */}
                    <View style={[styles_small.infoContainer]}>
                        {/* Title */}
                        <Text style={[s.tWhite, s.TlgBd]}>{event.title}</Text>
                        <View style={[styles.userContainer, s.Psm]}>
                            <View style={styles.userPbContainer}>
                                <Image
                                    source={{
                                        uri: event.creator.pbUri,
                                    }}
                                    style={styles.userPb}
                                    resizeMode="cover"
                                    resizeMethod="auto"
                                />
                            </View>
                            <Text
                                style={[
                                    s.Tmd,
                                    s.tWhite,
                                    {
                                        marginLeft: s.defaultMmd,
                                    },
                                ]}>
                                {event.creator.name}
                            </Text>
                        </View>
                        <View style={[styles_small.timeContainer]}>
                            <SVG_Live
                                fill={s.colors.red}
                                style={[
                                    styles.liveIcon,
                                    {
                                        opacity: checkIfLive(
                                            event.starting,
                                            event.ending
                                        )
                                            ? 1
                                            : 0.25,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    s.TsmLt,
                                    s.tWhite,
                                    { marginLeft: s.defaultMmd },
                                ]}>
                                {convertTimestampToString(event.starting)}
                                {"\n"}
                                {convertTimestampToString(event.ending)}
                            </Text>
                        </View>

                        <Text
                            style={[
                                s.tWhite,
                                style.Tmd,
                                s.pH,
                                { marginTop: s.defaultMsm },
                            ]}>
                            <Text style={[s.TlgBd]}>
                                {event.checks ? event.checks.length : 0}
                            </Text>
                            {getLangs("event_contentcard_small_0")}
                        </Text>
                    </View>
                    {/* Map Area */}
                    <View
                        style={[
                            styles_small.mapContainer,
                            s.oHidden,
                            s.allCenter,
                        ]}>
                        <MapView
                            ref={mapRef}
                            style={s.allMax}
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
                            onPress={onPress}>
                            {/* <Marker
                            coordinate={event.geoCords}
                            draggable={false}
                            tappable={false}>
                            
                        </Marker> */}
                        </MapView>
                        <SVG_Pin fill={s.colors.red} style={styles.marker} />
                    </View>
                </Pressable>
            </View>
        );
    //#endregion
    else return null;
}

const styles = StyleSheet.create({
    marker: {
        position: "absolute",
        zIndex: 99,
        height: 32,
        width: 32,
        transform: [
            {
                translateY: -12,
            },
        ],
        ...s.boxShadow,
    },
    liveIcon: {
        height: 32,
        width: 32,
    },

    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: s.defaultMsm,
    },
    userPbContainer: {
        aspectRatio: 1,
        flex: 1,
        width: "100%",
        maxWidth: 32,
        maxHeight: 32,
        borderRadius: 100,
        overflow: "hidden",
        justifyContent: "center",
    },
    userPb: {
        width: "100%",
        height: "100%",
    },
});

const styles_big = StyleSheet.create({
    headerContainer: {
        width: "100%",
        flexDirection: "column",
    },
    userContainer: {
        width: "100%",
        flexDirection: "row",
        marginTop: s.defaultMmd,
    },
    timeContainer: {
        flexDirection: "row",
        marginTop: s.defaultMsm,
    },
    mapContainer: {
        width: "100%",
        aspectRatio: 4 / 3,
        borderRadius: 10,
        marginTop: s.defaultMmd,
    },

    checkContainer: {
        marginTop: s.defaultMmd,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        ...s.pH,
    },
    checksContainer: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: "center",
        paddingRight: s.Pmd.paddingHorizontal,
    },
    checkButton: {
        maxHeight: 58,
        maxWidth: "100%",
        borderRadius: 25,
        overflow: "hidden",
    },
    checkButtonInner: {
        flexDirection: "row",
        justifyContent: "center",
    },
    checkButtonIcon: {
        aspectRatio: 1,
        maxWidth: 18,
        maxHeight: 18,
    },
});
const styles_medium = StyleSheet.create({
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
        marginRight: s.defaultMmd,
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
        marginTop: s.defaultMmd,
    },

    checkContainer: {
        marginTop: s.defaultMmd,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        ...s.pH,
    },
    checksContainer: {
        flex: 1,
        // flexDirection: "row",
        justifyContent: "center",
        paddingRight: s.Pmd.paddingHorizontal,
    },
    checkButton: {
        minHeight: 32,
        maxWidth: 58,
        aspectRatio: 1,
        borderRadius: 100,
        // ...s.border,
        // borderColor: s.colors.red,
    },
    checkButtonIcon: {
        aspectRatio: 1,
        maxWidth: 18,
        maxHeight: 18,
    },
});
const styles_small = StyleSheet.create({
    infoContainer: {
        flex: 1,
        paddingRight: s.defaultMmd,
    },

    timeContainer: {
        marginTop: s.defaultMsm,
        flexDirection: "row",
        alignItems: "center",
    },

    mapContainer: {
        flex: 1,
        borderRadius: 10,
    },
});
