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
    Group_Placeholder,
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
import Map from "../components/event/Map";

import SVG_Live from "../assets/svg/Live";
import SVG_Pin from "../assets/svg/Pin3.0";
import SVG_Translate from "../assets/svg/Translate";

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
import checkForAutoCorrectInside, {
    getCursorPosition,
} from "../constants/content/autoCorrect";
import {
    alertForTranslation,
    checkIsTranslated,
    getUnsignedTranslationText,
} from "../constants/content/translation";
import {
    checkForUnnecessaryNewLine,
    checkForURLs,
    getTimePassed,
    insertCharacterOnCursor,
} from "../constants/content";

import MapView, {
    Marker,
    PROVIDER_DEFAULT,
    PROVIDER_GOOGLE,
} from "react-native-maps";

const KEYBOARDBUTTON_ENABLED = false;

let cursorPos = -1;
export default function Event({ navigation, route, onTut }) {
    const mapRef = useRef();
    const commentInputRef = useRef();

    const [scrollable, setScrollable] = useState(true);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadData();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const { id } = route.params;

    const [user, setUser] = useState(User_Placeholder);
    const [event, setEvent] = useState(Event_Placeholder);
    const [group, setGroup] = useState(Group_Placeholder);

    const [autoCorrect, setAutoCorrect] = useState({
        status: 100,
        content: [],
    });

    const [isLive, setIsLive] = useState(false);
    const [currentMapType, setCurrentMapType] = useState(0);
    const [checksUserListData, setChecksUserListData] = useState([]);

    const [commentVisible, setCommentVisible] = useState(false);
    const [currentCommentInput, setCurrentCommentInput] = useState("");
    const [commentsList, setCommentsList] = useState([]);

    useEffect(() => {
        cursorPos = -1;
    }, []);

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

                if (eventData.group) getGroupData(eventData.group);
                if (eventData.comments) setCommentsList(eventData.comments);

                setEvent({
                    ...eventData,
                    checks: eventSnap.hasChild("checks")
                        ? eventData["checks"]
                        : [],
                    isBanned: false,
                });

                getIfCreatorIsClient(eventData.creator);

                mapRef.current.postMessage(
                    JSON.stringify({
                        action: "animate",
                        ...event.geoCords,
                        duration: 1,
                    })
                );

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

    const getGroupData = groupId => {
        get(child(ref(getDatabase()), `groups/${groupId}`))
            .then(groupSnap => {
                if (groupSnap.exists()) setGroup(groupSnap.val());
            })
            .catch(error =>
                console.log("error getGroupData", "pages/Event.jsx", error.code)
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
                currentCommentInput.length <= 256
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
                setCommentsList(prev => {
                    let newList = [
                        {
                            creator: uid,
                            created: Date.now(),
                            content: input,
                        },
                    ].concat(prev);

                    set(ref(getDatabase(), `events/${id}/comments`), newList);
                    return newList;
                });
            });
    };

    const removeComment = comment => {
        setCommentsList(prev => {
            let newList = prev.filter(c => c !== comment);
            set(ref(getDatabase(), `events/${id}/comments`), newList);
            return newList;
        });
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
                    scrollEnabled={scrollable}
                    automaticallyAdjustKeyboardInsets
                    automaticallyAdjustContentInsets
                    keyboardDismissMode="interactive"
                    snapToAlignment="center"
                    keyboardShouldPersistTaps="handled"
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
                            {checkIsTranslated(event.title) ? (
                                <Pressable
                                    onPress={alertForTranslation}
                                    style={[
                                        {
                                            width: 34,
                                            height: 34,
                                            marginHorizontal: style.defaultMmd,
                                            paddingTop: 6,
                                        },
                                        style.allCenter,
                                    ]}>
                                    <SVG_Translate
                                        style={{
                                            width: 26,
                                            aspectRatio: 1,
                                        }}
                                    />
                                </Pressable>
                            ) : null}
                            {checkLinkedUser(
                                getUnsignedTranslationText(
                                    checkForUnnecessaryNewLine(event.title)
                                )
                            ).map((el, key) =>
                                !el.isLinked ? (
                                    checkForURLs(el.text).map((el2, key2) =>
                                        !el2.hasUrl ? (
                                            <Text key={key2}>{el2.text}</Text>
                                        ) : (
                                            <Text
                                                key={key2}
                                                style={[
                                                    style.tBlue,
                                                    {
                                                        textDecorationLine:
                                                            "underline",
                                                        textDecorationColor:
                                                            style.colors.blue,
                                                    },
                                                ]}
                                                onPress={() =>
                                                    openLink(el2.text)
                                                }>
                                                {el2.text}
                                            </Text>
                                        )
                                    )
                                ) : (
                                    <Text
                                        key={key}
                                        style={style.tBlue}
                                        onPress={() =>
                                            navigation.push("profileView", {
                                                id: el.id,
                                            })
                                        }>
                                        {el.text}
                                    </Text>
                                )
                            )}
                        </Text>

                        {/* Map */}
                        <View
                            style={[
                                styles.mapContainer,
                                style.allCenter,
                                style.oHidden,
                            ]}
                            onTouchStart={() => setScrollable(false)}
                            onTouchEnd={() => setScrollable(true)}>
                            <Map
                                mapRef={mapRef}
                                style={style.allMax}
                                accessible={true}
                                initialRegion={event.geoCords}
                                marker={true}
                                title={getUnsignedTranslationText(event.title)}
                                onLongPress={() => {
                                    mapRef.current.postMessage(
                                        JSON.stringify({
                                            action: "animate",
                                            ...event.geoCords,
                                            duration: 1,
                                        })
                                    );
                                }}
                                onMessage={() => {}}
                                // onPress={() => {
                                //     mapRef.current.animateToRegion(
                                //         event.geoCords,
                                //         1000
                                //     );
                                // }}
                                // showsUserLocation
                                //userInterfaceStyle="dark"
                                //showsScale
                                //focusable={false}
                            />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={[style.Tmd, style.tWhite]}>
                                {checkIsTranslated(event.description) ? (
                                    <Pressable
                                        onPress={alertForTranslation}
                                        style={[
                                            {
                                                width: 18,
                                                height: 18,
                                                marginHorizontal:
                                                    style.defaultMmd,
                                            },
                                            style.allCenter,
                                        ]}>
                                        <SVG_Translate
                                            style={{
                                                width: 18,
                                                aspectRatio: 1,
                                            }}
                                        />
                                    </Pressable>
                                ) : null}
                                {checkLinkedUser(
                                    getUnsignedTranslationText(
                                        checkForUnnecessaryNewLine(
                                            event.description
                                        )
                                    )
                                ).map((el, key) =>
                                    !el.isLinked ? (
                                        checkForURLs(el.text).map((el2, key2) =>
                                            !el2.hasUrl ? (
                                                <Text key={key2}>
                                                    {el2.text}
                                                </Text>
                                            ) : (
                                                <Text
                                                    key={key2}
                                                    style={[
                                                        style.tBlue,
                                                        {
                                                            textDecorationLine:
                                                                "underline",
                                                            textDecorationColor:
                                                                style.colors
                                                                    .blue,
                                                        },
                                                    ]}
                                                    onPress={() =>
                                                        openLink(el2.text)
                                                    }>
                                                    {el2.text}
                                                </Text>
                                            )
                                        )
                                    ) : (
                                        <Text
                                            key={key}
                                            style={style.tBlue}
                                            onPress={() =>
                                                navigation.push("profileView", {
                                                    id: el.id,
                                                })
                                            }>
                                            {el.text}
                                        </Text>
                                    )
                                )}
                            </Text>
                            <Text
                                style={[
                                    style.tBlue,
                                    style.TsmLt,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getTimePassed(event.created)}
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
                    {/* Group */}
                    {event.group ? (
                        <View style={styles.sectionContainer}>
                            <Text style={[style.tWhite, style.TlgBd]}>
                                {getLangs("content_group_title")}
                            </Text>

                            <Pressable
                                style={[styles.userContainer, style.Psm]}
                                onPress={() =>
                                    navigation.push("groupView", {
                                        groupId: group.id,
                                    })
                                }>
                                <View
                                    style={[
                                        styles.userPbContainer,
                                        { borderRadius: 10 },
                                    ]}>
                                    <Image
                                        source={{
                                            uri: group.imgUri,
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
                                    {group.name}
                                </Text>
                            </Pressable>
                            <Text
                                style={[
                                    style.tWhite,
                                    style.Tmd,
                                    { marginTop: style.defaultMsm },
                                ]}>
                                {getLangs("content_group_sub")}
                            </Text>
                        </View>
                    ) : null}

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
                                    <View
                                        style={[
                                            styles.underSectionContainer,
                                            style.shadowSecSmall,
                                            {
                                                marginTop: style.defaultMmd,
                                                borderRadius: 10,
                                            },
                                        ]}>
                                        <Pressable
                                            onPress={() =>
                                                navigation.navigate("imgFull", {
                                                    uri: event.eventOptions
                                                        .adBanner.uri,
                                                })
                                            }
                                            style={[styles.rowContainer]}>
                                            <Image
                                                style={[
                                                    styles.adBanner,
                                                    {
                                                        aspectRatio:
                                                            event.eventOptions
                                                                .adBanner
                                                                .aspect,
                                                    },
                                                ]}
                                                source={{
                                                    uri: event.eventOptions
                                                        .adBanner.uri,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </Pressable>
                                    </View>
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
                                supportsAutoCorrect
                                onSelectionChange={async e => {
                                    cursorPos = e.nativeEvent.selection.start;

                                    const autoC =
                                        await checkForAutoCorrectInside(
                                            currentCommentInput,
                                            cursorPos
                                        );
                                    setAutoCorrect(autoC);
                                }}
                                onChangeText={async t => {
                                    // Get Current Cursor Position
                                    cursorPos = getCursorPosition(
                                        currentCommentInput,
                                        t
                                    );

                                    // Set new Input
                                    setCurrentCommentInput(t);

                                    // Get Auto Correction
                                    const autoC =
                                        await checkForAutoCorrectInside(
                                            t,
                                            cursorPos
                                        );
                                    setAutoCorrect(autoC);
                                }}
                                autoCorrection={autoCorrect}
                                applyAutoCorrection={word => {
                                    setCurrentCommentInput(prev => {
                                        let text = prev.split(" ");
                                        let textSubSplit = prev
                                            .substring(0, cursorPos)
                                            .split(" ");

                                        textSubSplit.pop();
                                        textSubSplit.push(word);

                                        let newText = "";
                                        textSubSplit.forEach(
                                            el => (newText += `${el} `)
                                        );
                                        for (
                                            let i = textSubSplit.length;
                                            i < text.length;
                                            i++
                                        )
                                            newText += `${text[i]}${
                                                i == text.length - 1 ? "" : " "
                                            }`;

                                        setAutoCorrect({
                                            status: 100,
                                            content: [],
                                        });
                                        return newText;
                                    });
                                }}
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
                                marginTop: 0,
                            }}>
                            {commentsList.map(comment => (
                                <Comment
                                    key={comment.created}
                                    style={{ marginTop: style.defaultMmd }}
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
                            edit={clientIsCreator}
                            del={clientIsCreator}
                            onEdit={() =>
                                navigation.navigate("eventCreate", {
                                    fromLinking: false,
                                    linkingData: null,
                                    fromEdit: true,
                                    editData: event,
                                })
                            }
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
                onElementPress={l =>
                    setCurrentCommentInput(prev =>
                        insertCharacterOnCursor(prev, cursorPos, l)
                    )
                }
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
        // transform: [
        //     {
        //         translateY: -16,
        //     },
        // ],
    },
});
