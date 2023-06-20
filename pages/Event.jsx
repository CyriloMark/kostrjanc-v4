import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Text,
    Image,
    TextInput,
    Platform,
    KeyboardAvoidingView,
} from "react-native";

import * as style from "../styles";

import { getDatabase, ref, get, child, set } from "firebase/database";
import { getAuth } from "firebase/auth";

import {
    Event_Placeholder,
    User_Placeholder,
} from "../constants/content/PlaceholderData";

import BackHeader from "../components/BackHeader";
import Comment from "../components/comments/Comment";
import InteractionBar from "../components/InteractionBar";
import NewCommentButton from "../components/comments/NewCommentButton";
import CheckButton from "../components/event/CheckButton";
import Tag from "../components/event/Tag";
import AccessoryView from "../components/AccessoryView";
import SendButton from "../components/comments/SendButton";
import DeleteButton from "../components/comments/DeleteButton";
import ListButton from "../components/event/ListButton";
import Refresh from "../components/RefreshControl";
import TextField from "../components/TextField";
import OpenKeyboardButton from "../components/comments/OpenKeyboardButton";

import SVG_Live from "../assets/svg/Live";
import SVG_Pin from "../assets/svg/Pin3.0";

import { convertTimestampToString } from "../constants/time";
import { wait } from "../constants/wait";
import {
    checkIfLive,
    Event_Types,
    mapTypes,
    Event_Tags,
    mapStylesDefault,
} from "../constants/event";
import { openLink } from "../constants";
import { getData } from "../constants/storage";
import { share } from "../constants/share";
import { getLangs } from "../constants/langs";
import { checkLinkedUser } from "../constants/content/linking";
import { checkIfTutorialNeeded } from "../constants/tutorial";

import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";

const KEYBOARDBUTTON_ENABLED = false;

export default function Event({ navigation, route, onTut }) {
    const mapRef = useRef();
    const commentInputRef = useRef();

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

    const [commentVisible, setCommentVisible] = useState(false);
    const [currentCommentInput, setCurrentCommentInput] = useState("");

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

                getIfCreatorIsClient(eventData.creator);

                mapRef.current.animateToRegion(eventData["geoCords"], 2500);

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
                                        id: eventData["checks"][i],
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
                if (a.length === 0) setChecksUserListData([]);
                for (let i = 0; i < a.length; i++) {
                    get(child(ref(db), "users/" + a[i]))
                        .then(checkSnap => {
                            if (checkSnap.exists()) {
                                const checkData = checkSnap.val();
                                checksList.push({
                                    id: a[i],
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

    const openCommentInput = () => {
        if (!commentVisible) {
            commentInputRef.current.focus();
            setCommentVisible(true);
        }
    };

    useEffect(() => {
        loadData();
        getIfAdmin();
        checkForTutorial();
    }, []);

    const checkForTutorial = async () => {
        const needTutorial = await checkIfTutorialNeeded(4);
        if (needTutorial) onTut(4);
    };

    const [clientIsAdmin, setClintIsAdmin] = useState(false);
    const getIfAdmin = async () => {
        await getData("userIsAdmin").then(isAdmin => {
            if (isAdmin === null) return setClintIsAdmin(false);
            return setClintIsAdmin(isAdmin);
        });
    };

    const [clientIsCreator, setClientIsCreator] = useState(false);
    const getIfCreatorIsClient = async creator => {
        await getData("userId").then(id => {
            if (id === creator) return setClientIsCreator(true);
            return setClientIsCreator(false);
        });
    };

    const publishComment = () => {
        if (event.isBanned) return;
        if (
            !(
                currentCommentInput.length > 0 &&
                currentCommentInput.length <= 64
            )
        )
            return;

        const input = currentCommentInput;
        setCurrentCommentInput("");
        setCommentVisible(false);

        let uid = "";
        getData("userId")
            .then(userID => {
                if (userID) uid = userID;
                else uid = getAuth().currentUser.uid;
            })
            .finally(() => {
                let a = event.comments ? event.comments : [];
                a.unshift({
                    creator: uid,
                    created: Date.now(),
                    content: input,
                });
                setEvent({
                    ...event,
                    comments: a,
                });

                const db = getDatabase();
                set(ref(db, `events/${id}/comments`), a);
            });
    };

    const removeComment = comment => {
        const newCommentList = event.comments.filter(c => c !== comment);
        setEvent(cur => {
            return {
                ...cur,
                comments: newCommentList,
            };
        });
        set(ref(getDatabase(), `events/${id}/comments`), newCommentList);
    };

    return (
        <View style={[style.container, style.bgBlack]}>
            <KeyboardAvoidingView
                style={style.allMax}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {/* Header */}
                <Pressable style={{ zIndex: 10 }}>
                    <BackHeader
                        // title={event.title}
                        title={""}
                        onBack={() => navigation.goBack()}
                        onReload={loadData}
                        showReload
                    />
                </Pressable>

                <ScrollView
                    scrollEnabled
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    keyboardDismissMode="interactive"
                    snapToAlignment="center"
                    snapToEnd
                    style={[style.container, style.pH, style.oVisible]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    refreshControl={
                        Platform.OS === "ios" ? (
                            <Refresh
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        ) : null
                    }>
                    {/* Map Container */}
                    <View>
                        {/* Title */}
                        <Text style={[style.tWhite, style.Ttitle2]}>
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
                                ref={mapRef}
                                style={style.allMax}
                                userInterfaceStyle="dark"
                                showsUserLocation
                                showsScale
                                customMapStyle={mapStylesDefault}
                                provider={PROVIDER_DEFAULT}
                                accessible={false}
                                focusable={false}
                                initialRegion={event.geoCords}
                                onPress={() => {
                                    mapRef.current.animateToRegion(
                                        event.geoCords,
                                        1000
                                    );
                                }}
                                // mapType={mapTypes[currentMapType]}
                                // onLongPress={() => {
                                //     setCurrentMapType(cur => {
                                //         return cur === 0 ? 1 : 0;
                                //     });
                                // }}
                            >
                                <Marker
                                    focusable
                                    draggable={false}
                                    title={event.title}
                                    coordinate={event.geoCords}>
                                    <SVG_Pin
                                        fill={style.colors.red}
                                        style={styles.marker}
                                    />
                                </Marker>
                            </MapView>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {checkLinkedUser(event.description).map(
                                    (el, key) =>
                                        !el.isLinked ? (
                                            <Text key={key}>{el.text}</Text>
                                        ) : (
                                            <Text
                                                key={key}
                                                style={style.tBlue}
                                                onPress={() =>
                                                    navigation.navigate(
                                                        "profileView",
                                                        {
                                                            id: el.id,
                                                        }
                                                    )
                                                }>
                                                {el.text}
                                            </Text>
                                        )
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* User Container */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("content_aboutcreator")}
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

                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("event_about_title")}
                        </Text>

                        {/* Time Start-End */}
                        <View
                            style={[
                                styles.underSectionContainer,
                                styles.rowContainer,
                            ]}>
                            <Text style={[style.tWhite, style.Tmd]}>
                                {convertTimestampToString(event.starting)}{" "}
                            </Text>
                            {isLive ? (
                                <SVG_Live
                                    style={styles.timeIcon}
                                    fill={style.colors.red}
                                />
                            ) : (
                                <Text style={[style.tWhite, style.Tmd]}>-</Text>
                            )}
                            <Text style={[style.tWhite, style.Tmd]}>
                                {" "}
                                {convertTimestampToString(event.ending)}
                            </Text>
                        </View>
                        {event.eventOptions ? (
                            <View>
                                {/* Type */}
                                {event.eventOptions.type !== undefined ? (
                                    <View
                                        style={[
                                            styles.underSectionContainer,
                                            styles.rowContainer,
                                        ]}>
                                        <Text style={[style.Tmd, style.tWhite]}>
                                            {getLangs("event_about_type")}{" "}
                                            {getLangs(
                                                Event_Types[
                                                    event.eventOptions.type
                                                ]
                                            )}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Entrance Fee */}
                                {event.eventOptions.entrance_fee !==
                                undefined ? (
                                    <View
                                        style={[
                                            styles.underSectionContainer,
                                            styles.rowContainer,
                                        ]}>
                                        <Text style={[style.Tmd, style.tWhite]}>
                                            {getLangs("event_about_entranefee")}{" "}
                                            {event.eventOptions.entrance_fee}€
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
                                            {getLangs("event_about_website")}{" "}
                                            <Text
                                                style={[
                                                    style.tBlue,
                                                    {
                                                        textDecorationStyle:
                                                            "solid",
                                                        textDecorationLine:
                                                            "underline",
                                                        textDecorationColor:
                                                            style.colors.blue,
                                                    },
                                                ]}>
                                                {event.eventOptions.website}
                                            </Text>
                                        </Text>
                                    </Pressable>
                                ) : null}

                                {/* Ad Banner */}
                                {event.eventOptions.adBanner ? (
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate("imgFull", {
                                                uri: event.eventOptions.adBanner
                                                    .uri,
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
                                                        event.eventOptions
                                                            .adBanner.aspect,
                                                },
                                            ]}
                                            source={{
                                                uri: event.eventOptions.adBanner
                                                    .uri,
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
                                        {event.eventOptions.tags.map(
                                            (tag, key) => (
                                                <Tag
                                                    key={key}
                                                    style={{
                                                        margin: style.defaultMsm,
                                                    }}
                                                    title={getLangs(
                                                        Event_Tags[tag]
                                                    )}
                                                />
                                            )
                                        )}
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                    </View>

                    {/* Checks */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("event_checkstitle")}
                        </Text>
                        <View
                            style={{
                                marginTop: style.defaultMmd,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                            <CheckButton
                                onPress={() => check()}
                                checked={event.checks.includes(
                                    getAuth().currentUser.uid
                                )}
                            />
                            {checksUserListData.length !== 0 ? (
                                <ListButton
                                    title={event.checks.length}
                                    style={{ marginLeft: style.defaultMsm }}
                                    onPress={() =>
                                        navigation.navigate("userList", {
                                            users: checksUserListData,
                                            title: getLangs(
                                                "event_checkspagetitle"
                                            ),
                                            needData: false,
                                        })
                                    }
                                />
                            ) : null}
                        </View>

                        <View
                            style={[
                                styles.checkListContainer,
                                {
                                    marginTop:
                                        checksUserListData.length === 0
                                            ? 0
                                            : style.defaultMmd,
                                },
                            ]}>
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
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("content_comments_title")}
                        </Text>
                        <View
                            style={{
                                marginTop: style.defaultMmd,
                                flexDirection: "row",
                            }}>
                            <NewCommentButton onPress={openCommentInput} />
                        </View>

                        {/* New comment */}
                        <Pressable
                            onPress={() => commentInputRef.current.focus()}
                            style={{
                                marginTop: commentVisible
                                    ? style.defaultMlg
                                    : 0,
                            }}>
                            {/* Title */}
                            {commentVisible ? (
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs(
                                        "content_comments_newcommenttitle"
                                    )}
                                </Text>
                            ) : null}
                            {/* Input */}
                            {/* <TextInput
                                ref={commentInputRef}
                                inputAccessoryViewID={"4127435841768339"}
                                allowFontScaling
                                autoCapitalize="none"
                                cursorColor={style.colors.blue}
                                multiline={true}
                                numberOfLines={1}
                                maxLength={128}
                                keyboardAppearance="dark"
                                keyboardType="default"
                                scrollEnabled
                                selectTextOnFocus
                                placeholder={`→ ${getLangs(
                                    "input_placeholder_entercomment"
                                )}`}
                                placeholderTextColor={style.colors.blue}
                                textAlign="left"
                                caretHidden
                                value={currentCommentInput}
                                textAlignVertical="center"
                                textBreakStrategy="simple"
                                onChangeText={t => setCurrentCommentInput(t)}
                                style={[
                                    { marginTop: style.defaultMmd },
                                    style.tWhite,
                                    !commentVisible ? { height: 0 } : null,
                                ]}
                            /> */}
                            <TextField
                                reference={commentInputRef}
                                inputAccessoryViewID={"4127435841768339"}
                                autoCapitalize="sentences"
                                placeholder={getLangs(
                                    "input_placeholder_entercomment"
                                )}
                                textBreakStrategy="simple"
                                scrollEnabled
                                selectTextOnFocus
                                maxLength={128}
                                value={currentCommentInput}
                                onChangeText={t => setCurrentCommentInput(t)}
                                style={[
                                    { marginTop: style.defaultMmd },
                                    style.tWhite,
                                    !commentVisible
                                        ? { height: 0, opacity: 0 }
                                        : null,
                                ]}
                            />
                            {commentVisible ? (
                                <View style={styles.commentsButtonContainer}>
                                    {Platform.OS === "android" &&
                                    KEYBOARDBUTTON_ENABLED ? (
                                        <OpenKeyboardButton
                                            onPress={() =>
                                                commentInputRef.current.focus()
                                            }
                                            style={{
                                                marginRight: style.defaultMsm,
                                            }}
                                        />
                                    ) : null}
                                    <DeleteButton
                                        onPress={() => {
                                            setCurrentCommentInput("");
                                            setCommentVisible(false);
                                        }}
                                    />
                                    <SendButton
                                        onPress={publishComment}
                                        style={{ marginLeft: style.defaultMmd }}
                                    />
                                </View>
                            ) : null}
                        </Pressable>

                        {/* Comments List */}
                        <View
                            style={{
                                marginTop: !commentVisible
                                    ? event.comments.length === 0
                                        ? 0
                                        : style.defaultMmd
                                    : style.defaultMlg,
                            }}>
                            {event.comments.map((comment, key) => (
                                <Comment
                                    key={key}
                                    style={
                                        key != event.comments.length - 1
                                            ? { marginBottom: style.defaultMmd }
                                            : null
                                    }
                                    commentData={comment}
                                    onRemove={() => removeComment(comment)}
                                    onPress={id =>
                                        navigation.navigate("profileView", {
                                            id: id,
                                        })
                                    }
                                    onCommentUserPress={id =>
                                        navigation.navigate("profileView", {
                                            id: id,
                                        })
                                    }
                                />
                            ))}
                        </View>
                    </View>

                    {/* Interaction Container */}
                    <View style={styles.sectionContainer}>
                        <Text style={[style.tWhite, style.TlgBd]}>
                            {getLangs("interactionbar_title")}
                        </Text>
                        <InteractionBar
                            style={{ marginTop: style.defaultMsm }}
                            ban={clientIsAdmin}
                            share
                            warn
                            del={clientIsCreator}
                            onShare={() => share(1, id, event.title)}
                            onWarn={() =>
                                navigation.navigate("report", {
                                    item: event,
                                    type: 1,
                                })
                            }
                            onBan={() =>
                                navigation.navigate("ban", {
                                    item: event,
                                    type: 1,
                                    id: event.id,
                                })
                            }
                            onDelete={() =>
                                navigation.navigate("delete", {
                                    type: 1,
                                    id: event.id,
                                })
                            }
                        />
                    </View>

                    <View style={styles.sectionContainer} />
                </ScrollView>
            </KeyboardAvoidingView>

            <AccessoryView
                text={currentCommentInput}
                onElementPress={l => setCurrentCommentInput(prev => prev + l)}
                nativeID={"4127435841768339"}
            />
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
    },
    checkPbIcon: {
        aspectRatio: 1,
        maxHeight: 32,
        maxWidth: 32,
        borderRadius: 100,
        margin: style.defaultMsm,
    },

    commentsButtonContainer: {
        marginTop: style.defaultMmd,
        flexDirection: "row",
        width: "100%",
        maxHeight: 58,
        alignItems: "center",
    },

    marker: {
        width: 32,
        height: 32,
    },
});
