import React, { useRef, useCallback, useState, useEffect } from "react";
import {
    Keyboard,
    Pressable,
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Platform,
} from "react-native";

//#region import Components
import AddButton from "../../components/content/AddButton";
import ContentHeader from "../../components/content/ContentHeader";
import InputField from "../../components/InputField";
import User from "../../components/cards/User";
import Refresh from "../../components/RefreshControl";
import AccessoryView from "../../components/AccessoryView";
import Post from "../../components/content/Post";
import Event from "../../components/content/Event";
import Event_Card from "../../components/cards/Event";
import VariableEventCard from "../../components/content/VariableEventCard";
//#endregion

import { getDatabase, get, ref, child } from "firebase/database";

//#region import Constants
import { wait } from "../../constants/wait";
import { sortByParameter, splitterForContent } from "../../constants";
import { getLangs } from "../../constants/langs";
import { checkIfTutorialNeeded } from "../../constants/tutorial";
import { getData, hasData, storeData } from "../../constants/storage";
import { convertTimestampToString } from "../../constants/time";

import makeRequest from "../../constants/request";
//#endregion

import * as style from "../../styles";

//#region imort SVGs
import SVG_Search from "../../assets/svg/Search";
//#endregion

import { LinearGradient } from "expo-linear-gradient";

const RANDOM_CONTENT_ENABLED = false;
//#region Event Recommendation
const EVENT_RECOMMENDATION_ENABLED = true;
const EVENT_FOLLOWING_FACTOR = 2;
const EVENT_AMOUNT_OF_RECOMMENDATION = 5;
//#endregion

export default function Content({ navigation, onTut }) {
    const contentScrollRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getRandomUser();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [searchInput, setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [randomUser, setRandomUser] = useState(null);
    const [randomContent, setRandomContent] = useState([
        { type: 1, id: 1679743329565 },
        { type: 0, id: 1679746265991 },
        { type: 0, id: 1681071258512 },
        { type: 1, id: 1679743805709 },
        { type: 0, id: 1679742742556 },
        { type: 0, id: 1679742606487 },
        { type: 0, id: 1679743122410 },
        { type: 1, id: 1679746016972 },
    ]);

    const [eventRanking, setEventRanking] = useState({
        lastUpdated: 0,
        events: [],
    });

    let shownRandomUsersList = [];
    let currentRandomUsersList = [];

    //#region Get Random User
    let loadingUsers = false;
    const getRandomUser = () => {
        if (loadingUsers) return;
        loadingUsers = true;

        if (currentRandomUsersList.length === 0) {
            makeRequest("/algo/follower", {
                max_followers: 4,
                max_out: 4,
                previous_followers: shownRandomUsersList,
            }).then(user => {
                loadingUsers = false;
                currentRandomUsersList = user["followers"];
                loadRandomUser();
            });
        } else loadRandomUser();
    };
    const loadRandomUser = () => {
        if (
            currentRandomUsersList.length === 0 ||
            !Array.isArray(currentRandomUsersList)
        ) {
            setRandomUser(null);
            return;
        }

        const db = getDatabase();

        let outputUsersList = [];
        for (let i = 0; i < currentRandomUsersList.length; i++) {
            shownRandomUsersList.push(currentRandomUsersList[i]);

            get(child(ref(db), `users/${currentRandomUsersList[i]}`))
                .then(userSnap => {
                    if (!userSnap.exists()) return;
                    const userData = userSnap.val();

                    const user = {
                        id: currentRandomUsersList[i],
                        name: userData["name"],
                        pbUri: userData["pbUri"],
                        description: userData["description"],
                        isBanned: userData["isBanned"],
                    };
                    outputUsersList.push(user);

                    if (
                        outputUsersList.length === currentRandomUsersList.length
                    ) {
                        currentRandomUsersList = [];
                        setRandomUser(outputUsersList);
                        loadingUsers = false;
                    }
                })
                .catch(error =>
                    console.log(
                        "error main/Content.jsx",
                        "getRandomUser get user",
                        error.code
                    )
                );
        }
    };
    //#endregion

    //#region Tutorials
    useEffect(() => {
        checkForTutorial();
    }, []);
    const checkForTutorial = async () => {
        const needTutorial = await checkIfTutorialNeeded(1);
        if (needTutorial) onTut(1);
    };
    //#endregion

    useEffect(() => {
        checkForTopEvents();
    }, []);

    //#region TopEvents
    const checkForTopEvents = async () => {
        get(child(ref(getDatabase()), "top_events"))
            .then(topEventsSnap => {
                if (!topEventsSnap.exists()) {
                    setEventRanking({
                        lastUpdated: 0,
                        events: [],
                    });
                    return;
                }
                const topEvents = topEventsSnap.val();
                getClientTopEvents(topEvents);
            })
            .catch(error =>
                console.log(
                    "error pages/main/Content.jsx",
                    "checkForTopEvents get top_events",
                    error.code
                )
            );
    };

    const getClientTopEvents = topEvents => {
        const lastUpdated = topEvents["updated"];
        const top10events = topEvents["events"];

        getData("userData").then(userData => {
            let followingList = [];
            if (userData["following"])
                userData["following"].forEach(e => followingList.push(e));

            const newTop10events = [];
            if (top10events !== undefined)
                top10events.forEach(e => {
                    if (followingList.includes(e.creator))
                        newTop10events.push({
                            ...e,
                            score: e.score * EVENT_FOLLOWING_FACTOR,
                        });
                    else newTop10events.push(e);
                });

            sortByParameter(newTop10events, "score");

            let clientEvents = newTop10events.slice(
                0,
                EVENT_AMOUNT_OF_RECOMMENDATION
            );

            setEventRanking({
                lastUpdated: lastUpdated,
                events: clientEvents,
            });
        });
    };
    //#endregion

    return (
        <View style={[style.container, style.bgBlack]}>
            <ContentHeader
                onBack={() => navigation.navigate("landing")}
                onSettingsPress={() => navigation.navigate("settings")}
            />
            {/* Search Input */}
            <LinearGradient
                colors={[style.colors.black, "transparent"]}
                style={[style.pH, styles.searchContainer]}>
                <InputField
                    placeholder={getLangs("input_placeholder_search")}
                    value={searchInput}
                    inputAccessoryViewID="content_search_InputAccessoryViewID"
                    icon={<SVG_Search fill={style.colors.blue} />}
                    onChangeText={val => {
                        setSearchInput(val);
                        if (val !== "") {
                            makeRequest("/user/search", {
                                query: val,
                            })
                                .then(rsp => {
                                    let results = [];
                                    rsp.hits.map(hit =>
                                        results.push({
                                            name: hit.primary,
                                            pbUri: hit.img,
                                            id: hit.id.substring(2),
                                        })
                                    );
                                    setSearchResult(results);
                                })
                                .catch(error =>
                                    console.log(
                                        "error getMeiliSearch request",
                                        "InputField pages/main/Content.jsx",
                                        error
                                    )
                                );
                        }
                    }}
                    maxLength={32}
                    bg={`rgba(${style.colorsRGB.black},.25)`}
                />
            </LinearGradient>

            <ScrollView
                ref={contentScrollRef}
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
                    Platform.OS === "ios" ? (
                        <Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : null
                }>
                <Pressable
                    onPress={Keyboard.dismiss}
                    style={{ alignItems: "center" }}>
                    {randomUser ? (
                        <View
                            style={{
                                marginTop: style.defaultMmd,
                                width: "100%",
                                alignItems: "center",
                            }}>
                            <Text style={[style.tWhite, style.Tmd]}>
                                {getLangs("contentpage_contenthint")}
                            </Text>
                            <View
                                style={[
                                    {
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        marginTop: style.defaultMmd,
                                    },
                                    style.allCenter,
                                ]}>
                                <User
                                    style={{
                                        margin: style.defaultMsm,
                                    }}
                                    onPress={() => {
                                        navigation.navigate("profileView", {
                                            id: randomUser[0].id,
                                        });
                                    }}
                                    user={randomUser[0]}
                                />
                            </View>
                        </View>
                    ) : (
                        <Text
                            style={[
                                style.tWhite,
                                style.TlgBd,
                                { marginTop: style.defaultMmd },
                            ]}>
                            {getRandomUser()}
                            {getLangs("contentpage_search")}
                        </Text>
                    )}

                    {
                        //#region Search Result
                        searchResult.length !== 0 ? (
                            <View style={styles.sectionContainer}>
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs("contentpage_searchresulttext")}
                                </Text>
                                {searchResult.map(user => (
                                    <Pressable
                                        key={user.id}
                                        style={[
                                            styles.userContainer,
                                            style.Psm,
                                        ]}
                                        onPress={() =>
                                            navigation.navigate("profileView", {
                                                id: user.id,
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
                                                    marginLeft:
                                                        style.defaultMmd,
                                                },
                                            ]}>
                                            {user.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        ) : null
                        //#endregion
                    }

                    {/* Random Content */}
                    {
                        //#region Random Content
                        randomContent.length !== 0 && RANDOM_CONTENT_ENABLED ? (
                            <View style={styles.sectionContainer}>
                                <Text style={[style.tWhite, style.TlgBd]}>
                                    {getLangs("contentpage_randomresulttext")}
                                </Text>
                                <View style={{ marginTop: style.defaultMsm }}>
                                    {splitterForContent(randomContent, 3).map(
                                        (line, lineKey) => (
                                            <View
                                                key={lineKey}
                                                style={
                                                    styles.randomContentLineContainer
                                                }>
                                                {line.map((item, key) =>
                                                    item.type === 0 ? (
                                                        <Post
                                                            key={key}
                                                            id={item.id}
                                                            style={
                                                                styles.randomContentElement
                                                            }
                                                            onPress={() =>
                                                                navigation.navigate(
                                                                    "postView",
                                                                    {
                                                                        id: item.id,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    ) : line.length === 1 ? (
                                                        <Event_Card
                                                            key={key}
                                                            style={
                                                                styles.randomContentElement
                                                            }
                                                            id={item.id}
                                                            onPress={() =>
                                                                navigation.navigate(
                                                                    "eventView",
                                                                    {
                                                                        id: item.id,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <Event
                                                            style={
                                                                styles.randomContentElement
                                                            }
                                                            key={key}
                                                            id={item.id}
                                                            onPress={() =>
                                                                navigation.navigate(
                                                                    "eventView",
                                                                    {
                                                                        id: item.id,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    )
                                                )}
                                            </View>
                                        )
                                    )}
                                </View>
                            </View>
                        ) : null
                        //#endregion
                    }

                    {
                        //#region Event Recommendation
                        EVENT_RECOMMENDATION_ENABLED ? (
                            <View style={styles.sectionContainer}>
                                <Text
                                    style={[
                                        style.tWhite,
                                        style.Tmd,
                                        { textAlign: "center" },
                                    ]}>
                                    {getLangs("contentpage_eventlisttitle")}
                                </Text>

                                <View style={{ marginTop: style.defaultMmd }}>
                                    {eventRanking.events.map((e, key) => (
                                        <VariableEventCard
                                            key={key}
                                            size={getSize(key)}
                                            data={e}
                                            onPress={() =>
                                                navigation.navigate(
                                                    "eventView",
                                                    {
                                                        id: e.id,
                                                    }
                                                )
                                            }
                                            style={{
                                                marginTop: style.defaultMmd,
                                            }}
                                        />
                                    ))}
                                </View>

                                <Text
                                    style={[
                                        style.TsmRg,
                                        style.tWhite,
                                        {
                                            marginTop: style.defaultMlg,
                                            textAlign: "center",
                                        },
                                    ]}>
                                    {eventRanking.events.length !== 0
                                        ? `${getLangs(
                                              "contentpage_lastupdatetext"
                                          )} ${convertTimestampToString(
                                              eventRanking.lastUpdated
                                          )}`
                                        : getLangs("contentpage_noevents")}
                                </Text>
                            </View>
                        ) : null
                        //#endregion
                    }
                </Pressable>

                <View style={{ marginTop: style.defaultMlg * 4 }} />
            </ScrollView>

            <View style={[styles.addBtnContainer, style.allCenter]}>
                <AddButton
                    checked={false}
                    onPress={() => navigation.navigate("landingCreate")}
                    style={{ zIndex: 2 }}
                />
            </View>

            {/* Search Input */}
            <AccessoryView
                onElementPress={l => {
                    setSearchInput(prev => {
                        return prev + l;
                    });
                }}
                nativeID={"content_search_InputAccessoryViewID"}
            />
        </View>
    );
}

const getSize = size => {
    if (size === 0) return 0;
    else if (size <= 2) return 1;
    return 2;
};

const styles = StyleSheet.create({
    addBtnContainer: {
        position: "absolute",
        width: "100%",
        bottom: Platform.OS === "ios" ? style.defaultMmd : style.defaultMlg,
        minHeight: 72,
    },

    sectionContainer: {
        width: "100%",
        marginTop: style.defaultMlg,
    },

    searchContainer: {
        width: "100%",
        height: 58 + style.defaultMsm * 4,
        paddingVertical: style.defaultMsm,
        zIndex: 10,
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

    sideBox: {
        position: "absolute",
        aspectRatio: 1,
        width: 58,
        zIndex: 2,
    },
    sideBoxInner: {
        borderColor: style.colors.blue,
        backgroundColor: `rgba(${style.colorsRGB.black}, .75)`,
        borderRadius: 10,
    },

    randomContentLineContainer: {
        width: "100%",
        flexDirection: "row",
    },
    randomContentElement: {
        flex: 1,
        margin: style.defaultMsm,
    },

    randomUserContainer: {
        width: "100%",
        flex: 1,
        borderRadius: 25,
    },
    randomUserInner: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 25,
    },
    randomUserIconContainer: {
        flex: 1,
    },
    randomUserUserContainer: {
        flex: 3,
        flexDirection: "column",
    },
});
