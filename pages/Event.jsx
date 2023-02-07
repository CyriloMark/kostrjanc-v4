import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
} from "react-native";

import * as style from "../styles";

import { getDatabase, ref, get, child, set } from "firebase/database";
import { getAuth } from "firebase/auth";

import {
    Event_Placeholder,
    User_Placeholder,
} from "../constants/content/PlaceholderData";

import BackHeader from "../components/BackHeader";
import Refresh from "../components/RefreshControl";
import Comment from "../components/comments/Comment";
import InteractionBar from "../components/InteractionBar";
import NewCommentButton from "../components/comments/NewCommentButton";
import CheckButton from "../components/event/CheckButton";
import Tag from "../components/event/Tag";

import SVG_Live from "../assets/svg/Live";

import { convertTimestampToString } from "../constants/time";
import { wait } from "../constants/wait";
import {
    checkIfLive,
    Event_Types,
    mapTypes,
    Event_Tags,
} from "../constants/event";
import { openLink } from "../constants";
import { getData } from "../constants/storage";

import MapView, { Marker } from "react-native-maps";

export default function Event({ navigation, route }) {
    const scrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [event, setEvent] = useState(Event_Placeholder);

    const [isLive, setIsLive] = useState(false);
    const [currentMapType, setCurrentMapType] = useState(0);
    const [checksUserListData, setChecksUserListData] = useState([]);

    const loadData = () => {
        const db = getDatabase();
        get(child(ref(db), "events/" + id))
            .then(eventSnap => {
                if (!eventSnap.exists()) {
                    setEvent(Event_Placeholder);
                    setUser(User_Placeholder);
                    return;
                }
                const eventData = eventSnap.val();

                if (eventSnap.hasChild("isBanned")) {
                    if (eventData["isBanned"]) {
                        setEvent({
                            ...Event_Placeholder,
                            isBanned: true,
                        });
                        setUser(User_Placeholder);
                        return;
                    }
                }

                setEvent({
                    ...eventData,
                    checks: eventSnap.hasChild("checks")
                        ? eventData["checks"]
                        : [],
                    comments: eventSnap.hasChild("comments")
                        ? eventData["comments"]
                        : [],
                    isBanned: false,
                });

                setIsLive(
                    checkIfLive(eventData["starting"], eventData["ending"])
                );

                // Get Check user Data
                if (eventSnap.hasChild("checks")) {
                    let checksList = [];
                    for (let i = 0; i < eventData["checks"].length; i++) {
                        get(child(ref(db), "users/" + eventData["checks"][i]))
                            .then(checkSnap => {
                                if (checkSnap.exists()) {
                                    const a = checkSnap.val();
                                    checksList.push({
                                        name: a["name"],
                                        pbUri: a["pbUri"],
                                    });
                                }
                            })
                            .catch(error =>
                                console.log(
                                    "error pages/Event.jsx",
                                    "get checks user data",
                                    error.code
                                )
                            )
                            .finally(() => {
                                if (i === eventData["checks"].length - 1)
                                    setChecksUserListData(checksList);
                            });
                    }
                }

                get(child(ref(db), "users/" + eventData["creator"]))
                    .then(userSnap => {
                        if (!userSnap.exists()) {
                            setUser(User_Placeholder);
                            return;
                        }

                        const userData = userSnap.val();

                        setUser(userData);
                    })
                    .catch(error =>
                        console.log("pages/Event.jsx", "get user", error.code)
                    );
            })
            .catch(error =>
                console.log("pages/Event.jsx", "get event", error.code)
            );
    };

    const check = () => {
        let a = event.checks;

        let uid = "";

        getData("userId")
            .then(id => {
                if (!id) uid = getAuth();
                else uid = id;
            })
            .finally(() => {
                if (a.includes(uid)) a.splice(a.indexOf(uid), 1);
                else a.push(uid);

                const db = getDatabase();
                let checksList = [];
                for (let i = 0; i < a.length; i++) {
                    get(child(ref(db), "users/" + a[i]))
                        .then(checkSnap => {
                            if (checkSnap.exists()) {
                                const checkData = checkSnap.val();
                                checksList.push({
                                    name: checkData["name"],
                                    pbUri: checkData["pbUri"],
                                });
                            }
                        })
                        .catch(error =>
                            console.log(
                                "error pages/Event.jsx",
                                "get checks check() user data",
                                error.code
                            )
                        )
                        .finally(() => {
                            if (i === a.length - 1)
                                setChecksUserListData(checksList);
                        });
                }

                setEvent({
                    ...event,
                    checks: a,
                });

                set(ref(db, "events/" + event.id), {
                    ...event,
                    checks: a,
                });
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <View style={[style.container, style.bgBlack]}>
            {/* Header */}
            <Pressable
                style={{ zIndex: 10 }}
                onPress={() =>
                    scrollRef.current.scrollTo({
                        y: 0,
                        animated: true,
                    })
                }>
                <BackHeader
                    title={event.title}
                    onBack={() => navigation.goBack()}
                />
            </Pressable>

            <ScrollView
                ref={scrollRef}
                style={[
                    style.container,
                    style.pH,
                    style.oVisible,
                    { marginTop: style.defaultMsm },
                ]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd
                refreshControl={
                    <Refresh onRefresh={onRefresh} refreshing={refreshing} />
                }>
                {/* Map Container */}
                <View>
                    {/* Title */}
                    <Text style={[style.tWhite, style.TlgBd]}>
                        {event.title}
                    </Text>

                    {/* Map */}
                    <View
                        style={[
                            styles.mapContainer,
                            style.allCenter,
                            style.oHidden,
                        ]}>
                        <MapView
                            style={style.allMax}
                            userInterfaceStyle="dark"
                            showsUserLocation
                            showsScale
                            mapType={mapTypes[currentMapType]}
                            accessible={false}
                            onLongPress={() => {
                                setCurrentMapType(cur => {
                                    return cur === 0 ? 1 : 0;
                                });
                            }}
                            focusable={false}
                            initialRegion={event.geoCords}>
                            <Marker
                                focusable
                                draggable={false}
                                title={event.title}
                                coordinate={event.geoCords}
                            />
                        </MapView>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[style.Tmd, style.tWhite]}>
                            {event.description}
                        </Text>
                    </View>
                </View>

                {/* User Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Přez awtora:
                    </Text>

                    <Pressable
                        style={[styles.userContainer, style.Psm]}
                        onPress={() =>
                            navigation.push("profileView", {
                                id: event.creator,
                            })
                        }>
                        <View style={styles.userPbContainer}>
                            <Image
                                source={{
                                    uri: user.pbUri,
                                }}
                                style={styles.userPb}
                                resizeMode="cover"
                                resizeMethod="auto"
                            />
                        </View>
                        <Text
                            style={[
                                style.Tmd,
                                style.tWhite,
                                {
                                    marginLeft: style.defaultMmd,
                                },
                            ]}>
                            {user.name}
                        </Text>
                    </Pressable>
                </View>

                {/* Event Data Container */}
                {event.eventOptions ? (
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            Přez ewent:
                        </Text>

                        {/* Live */}
                        {isLive ? (
                            <View style={styles.underSectionContainer}>
                                <SVG_Live
                                    style={styles.timeIcon}
                                    fill={style.colors.red}
                                />
                            </View>
                        ) : null}

                        {/* Time Start-End */}
                        <View
                            style={[
                                styles.underSectionContainer,
                                styles.rowContainer,
                            ]}>
                            {!isLive ? (
                                <Text style={[style.tWhite, style.Tmd]}>
                                    {convertTimestampToString(event.starting)} -{" "}
                                    {convertTimestampToString(event.ending)}
                                </Text>
                            ) : event.ending < Date.now() ? (
                                <Text>Ewent je so hižo zakónčił.</Text>
                            ) : (
                                <View></View>
                            )}
                        </View>

                        {/* Type */}
                        {event.eventOptions.type !== undefined ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Družina:{" "}
                                    {Event_Types[event.eventOptions.type]}
                                </Text>
                            </View>
                        ) : null}

                        {/* Entrance Fee */}
                        {event.eventOptions.entrance_fee !== undefined ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Zastup: {event.eventOptions.entrance_fee}€
                                </Text>
                            </View>
                        ) : null}

                        {/* Website */}
                        {event.eventOptions.website ? (
                            <Pressable
                                style={styles.underSectionContainer}
                                onPress={() =>
                                    openLink(event.eventOptions.website)
                                }>
                                <Text style={[style.Tmd, style.tWhite]}>
                                    Webstrona: {event.eventOptions.website}
                                </Text>
                            </Pressable>
                        ) : null}

                        {/* Ad Banner */}
                        {event.eventOptions.adBanner ? (
                            <Pressable
                                onPress={() =>
                                    navigation.navigate("imgFull", {
                                        uri: event.eventOptions.adBanner.uri,
                                    })
                                }
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                ]}>
                                <Image
                                    style={[
                                        styles.adBanner,
                                        {
                                            aspectRatio:
                                                event.eventOptions.adBanner
                                                    .aspect,
                                        },
                                    ]}
                                    source={{
                                        uri: event.eventOptions.adBanner.uri,
                                    }}
                                    resizeMode="cover"
                                />
                            </Pressable>
                        ) : null}

                        {/* Tags */}
                        {event.eventOptions.tags ? (
                            <View
                                style={[
                                    styles.underSectionContainer,
                                    styles.rowContainer,
                                    { flexWrap: "wrap" },
                                ]}>
                                {event.eventOptions.tags.map((tag, key) => (
                                    <Tag
                                        key={key}
                                        style={{ margin: style.defaultMsm }}
                                        title={Event_Tags[tag]}
                                    />
                                ))}
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {/* Checks */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Štó je pódla:
                    </Text>
                    <View style={{ marginTop: style.defaultMmd }}>
                        <CheckButton
                            onPress={() => check()}
                            checked={event.checks.includes(
                                getAuth().currentUser.uid
                            )}
                        />
                    </View>

                    <View style={styles.checkListContainer}>
                        {checksUserListData.map((user, key) => (
                            <Image
                                key={key}
                                source={{ uri: user.pbUri }}
                                resizeMode="contain"
                                style={[
                                    style.oHidden,
                                    style.allMax,
                                    styles.checkPbIcon,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Comments Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>Komentary:</Text>
                    <View style={{ marginTop: style.defaultMmd }}>
                        <NewCommentButton />
                    </View>

                    <View style={{ marginTop: style.defaultMmd }}>
                        {event.comments.map((comment, key) => (
                            <Comment
                                key={key}
                                style={
                                    key != event.comments.length - 1
                                        ? { marginBottom: style.defaultMmd }
                                        : null
                                }
                                commentData={comment}
                            />
                        ))}
                    </View>
                </View>

                {/* Interaction Container */}
                <View style={styles.sectionContainer}>
                    <Text style={[style.tWhite, style.TlgBd]}>
                        Funkcije za wužiwarja:
                    </Text>
                    <InteractionBar
                        style={{ marginTop: style.defaultMsm }}
                        ban
                        share
                        warn
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    interactionBarContainer: {
        position: "absolute",
        width: "100%",
        bottom: style.defaultMsm,
    },

    titleContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    titleLiveContainer: {
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
    mapContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
        marginTop: style.defaultMmd,
    },
    textContainer: {
        // paddingHorizontal: style.Psm.paddingHorizontal,
        width: "100%",
        marginTop: style.defaultMmd,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },
    underSectionContainer: {
        width: "100%",
        marginTop: style.defaultMmd,
    },

    userContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: style.defaultMsm,
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

    timesContainer: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
    },
    timeIcon: {
        aspectRatio: 1,
        maxHeight: 24,
        maxWidth: 24,
        width: "100%",
    },
    timeLine: {
        width: 1,
        height: "100%",
    },

    rowContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },

    adBanner: {
        width: "100%",
        borderRadius: 10,
    },

    checkListContainer: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: style.defaultMmd,
    },
    checkPbIcon: {
        aspectRatio: 1,
        maxHeight: 32,
        maxWidth: 32,
        borderRadius: 100,
        margin: style.defaultMsm,
    },
});
