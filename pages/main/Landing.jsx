import React, { useState, useCallback, useEffect, useRef } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

import { useIsFocused } from "@react-navigation/native";

import * as style from "../../styles";

//#region import Constants
import { wait } from "../../constants/wait";
import { getData, storeData } from "../../constants/storage";
import { User_Placeholder } from "../../constants/content/PlaceholderData";
import { General_Group } from "../../constants/content/GroupData";
import { lerp, sortArrayByDateFromUnderorderedKey } from "../../constants";
import { getLangs } from "../../constants/langs";
import { checkIfTutorialNeeded } from "../../constants/tutorial";
import fetchCachedContentData from "../../constants/content/contentCacheLoader";
import { checkForChallengable } from "../../constants/content";
import { addNotificationResponseReceivedListener } from "expo-notifications";

//#region import Firebase
import { getAuth } from "firebase/auth";
import { get, ref, getDatabase, child } from "firebase/database";

//#region import Components
import AppHeader from "../../components/landing/AppHeader";
import Post from "../../components/cards/Post";
import Event from "../../components/cards/Event";
import Banner from "../../components/cards/Banner";
import Challenge from "../../components/cards/Challenge";
import Refresh from "../../components/RefreshControl";
import GroupSelect from "../../components/landing/GroupSelect";
import ShowNewButton from "../../components/content/ShowNewButton";
import Calendar from "../../components/calendar/Calendar";

import Loading from "../static/Loading";

//#region import Content Algorithms
import handleBannerContent from "../../constants/content/bannerContent";
import handleGeneralContent from "../../constants/content/generalContent";
import handleGroupContent from "../../constants/content/groupContent";
import handleChallengeContent from "../../constants/content/challengeContent";

let LOADING = false;
let LAST_UPDATED = 0;
let SETTING_NEW_CONTENT = false;

const CALENDAR_ENABLED = true;

let showingContent = [];

let showingPosts = [];
let showingEvents = [];

const UPDATE_COOLDOWN = 2500;
let GROUP_SELECT_PRESSED = false;

let SELECTED_GROUP = {
    id: 0,
    groupData: General_Group,
};

export default function Landing({ navigation, onTut }) {
    const isFocused = useIsFocused();

    const mainScrollViewRef = useRef();

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setNewFetchedContent(null);
        loadUser();

        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [user, setUser] = useState(User_Placeholder);

    const [loading, setLoading] = useState(true);

    const [bannerData, setBannerData] = useState([]);
    const [contentData, setContentData] = useState([]);
    const [newFetchedContent, setNewFetchedContent] = useState(null);

    const loadUser = async () => {
        const id = getAuth().currentUser.uid;
        storeData("userId", id);

        const db = getDatabase();
        get(child(ref(db), "users/" + id))
            .then(userSnap => {
                if (!userSnap.exists()) return;
                const userData = userSnap.val();

                // Man könnte hier ban abfragen
                setUser(userData);
                storeData("userData", userData);

                if (userData.posts) checkForChallengable(userData.posts);

                // USER-ID, UserData, Should Load Banners
                getGroupSpecificContent(id, userData, true, SELECTED_GROUP.id);
            })
            .catch(error =>
                console.log(
                    "error main/Landing.jsx",
                    "get user data",
                    error.code
                )
            );
    };

    useEffect(() => {
        SETTING_NEW_CONTENT = false;
        setLoading(true);
        loadUser();
        checkForTutorial();
        checkForNotificationResponse();
    }, []);

    const refreshContent = () => {
        showingPosts = [];
        showingEvents = [];
        showingContent = [];
    };

    // Check for Group
    useEffect(() => {
        const focusUnsub = navigation.addListener("state", e => {
            if (
                GROUP_SELECT_PRESSED &&
                e.data.state.routes.length === 1 &&
                e.data.state.routes[0].params
            ) {
                const group = e.data.state.routes[0].params?.group;

                if (group && group != SELECTED_GROUP) {
                    SELECTED_GROUP = group;

                    refreshContent();
                    getGroupSpecificContent(null, null, true, group.id);
                }

                GROUP_SELECT_PRESSED = false;
            } else if (e.data.state.routes.length === 1) {
                // If coming from other Screen
                // getGroupSpecificContent(null, null, true, SELECTED_GROUP.id);
            }
        });

        return () => focusUnsub;
    }, [navigation]);

    /**
     *
     * @param {String} _id Id of Client User
     * @param {Object} user User Data
     * @param {boolean} updateBanners `true` if the Algorithm needs to load banners new. Also fetches specific Data new.
     * @param {number | String} groupId Id of currently selected Group
     * @returns
     */
    const getGroupSpecificContent = async (
        _id,
        user,
        updateBanners,
        groupId
    ) => {
        //#region Loading Screen and avoid multiple calls
        if (groupId != 1) {
            if (LAST_UPDATED > Date.now() - UPDATE_COOLDOWN) return;
            if (LOADING) return;
            LOADING = true;
        }
        //#endregion

        //#region Handle banners
        if (updateBanners) {
            const banners = await handleBannerContent();
            setBannerData(banners);
            setContentData([]);
        }
        //#endregion

        let cachedData = null;
        // if (updateBanners)
        //     cachedData = await fetchCachedContentData(SELECTED_GROUP.id);

        if (cachedData !== null && cachedData.length !== 0) {
            setContentData(() => {
                showingContent = cachedData;
                setCorrectShowingPostEventLists(cachedData);
                return cachedData;
            });

            //#region Handle Loading
            setLoading(false);
            LOADING = false;
            LAST_UPDATED = Date.now();
            //#endregion
        }

        // Safe new Showing Content here
        let newShowingContent = [];

        //#region Handle different cases
        if (groupId === 0)
            newShowingContent = await handleGeneralContent(
                user,
                showingPosts,
                showingEvents
            );
        else if (groupId === 1) FORYOU_ALGORITHM(_id);
        else if (groupId === 2)
            newShowingContent = await handleChallengeContent(
                null, //cachedData,
                showingPosts,
                updateBanners
            );
        else
            newShowingContent = await handleGroupContent(
                SELECTED_GROUP.groupData,
                showingPosts,
                showingEvents,
                updateBanners
            );
        //#endregion

        //#region Set Content
        // if (
        //     cachedData !== null &&
        //     cachedData.length !== 0 &&
        //     newShowingContent.length !== 0
        // )
        //     return setNewFetchedContent(newShowingContent);

        setContentData(prev => {
            showingContent.push(...newShowingContent);

            const outputContent = prev.concat(newShowingContent);
            return outputContent;
        });
        //#endregion

        //#region Handle Loading
        setLoading(false);
        LOADING = false;
        LAST_UPDATED = Date.now();
        //#endregion
    };

    const setCorrectShowingPostEventLists = content => {
        for (let i = 0; i < content.length; i++)
            if (content[i].type === 0) showingPosts.push(content[i].id);
            else if (content[i].type === 1) showingEvents.push(content[i].id);
    };

    /**
     * Checks on Load for necessary Tutorial Clips
     */
    const checkForTutorial = async () => {
        const needTutorial = await checkIfTutorialNeeded(0);
        if (needTutorial) onTut(0);
    };

    const checkForNotificationResponse = () => {
        addNotificationResponseReceivedListener(rps => {
            const route = rps.notification.request.content.data.route;
            const params = rps.notification.request.content.data.params;

            navigation.navigate(route, params);
        });
    };

    //#region FORYOU CONTENT
    async function FORYOU_ALGORITHM(_id) {
        //#region Loading Screen and avoid multiple calls
        if (LAST_UPDATED > Date.now() - UPDATE_COOLDOWN) return;
        if (LOADING) return;
        LOADING = true;
        //#endregion

        console.log("FORYOU_ALGORITHM");

        // Firebase Database Connection
        const db = ref(getDatabase());

        const currentDate = Date.now();

        //#region get Amounts of Content 0: posts; 1: events; (2: ads);
        if (!AMTs[4])
            await get(child(db, `AMT_post-event-ad`))
                .then(amtsSnap => {
                    if (amtsSnap.exists()) AMTs = [...amtsSnap.val(), true];
                    else return;
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "foryou_algo get amts",
                        error.code
                    )
                );
        //#endregion

        const POST_AMT = AMTs[0];
        const EVENT_AMT = AMTs[1];

        let postsList = await foryou_getPosts(POST_AMT);
        // let eventsLists = await getEvents(clientFollowingList, EVENT_AMT);
        console.log(showingContent);
        setContentData(prev => {
            return {
                ...prev,
                content: showingContent,
            };
        });

        setLoading(false);
        LOADING = false;
        LAST_UPDATED = Date.now();
    }
    //#endregion

    const handleNewCachedContent = () => {
        // if (newFetchedContent === null || SETTING_NEW_CONTENT) return;
        // SETTING_NEW_CONTENT = true;
        // console.log(showingContent);
        // showingContent.splice(0, 0, ...newFetchedContent);
        // setContentData(prev => {
        //     let outputContentList = prev.content;
        //     for (let i = newFetchedContent.length - 1; i >= 0; i++)
        //         outputContentList.splice(0, 0, newFetchedContent[i]);
        //     return {
        //         ...prev,
        //         content: outputContentList,
        //     };
        // });
        // setNewFetchedContent(null);
        // mainScrollViewRef.current?.scrollTo({
        //     y: 0,
        //     animated: true,
        // });
        // SETTING_NEW_CONTENT = false;
    };

    // If the Algorithm is loading => Loading Page
    if (loading) return <Loading />;

    return (
        <View style={[style.container, style.bgBlack]}>
            <Pressable style={{ zIndex: 10 }}>
                <AppHeader
                    pbUri={user.pbUri}
                    onUserPress={() => navigation.navigate("userProfile")}
                    onContentPress={() => navigation.navigate("content")}
                />
            </Pressable>

            {
                //#region Group Select Area
            }
            <GroupSelect
                activeGroup={SELECTED_GROUP}
                openGroupSelect={() => {
                    GROUP_SELECT_PRESSED = true;
                    navigation.navigate("groupSelect", {
                        activeGroup: SELECTED_GROUP,
                    });
                }}
            />

            {newFetchedContent !== null ? (
                <ShowNewButton onPress={handleNewCachedContent} />
            ) : null}

            <ScrollView
                ref={mainScrollViewRef}
                style={[style.container, style.pH, style.oVisible]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd
                scrollEventThrottle={1024}
                refreshControl={
                    Platform.OS === "ios" ? (
                        <Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : null
                }
                onScroll={({ nativeEvent }) => {
                    if (!isFocused) return;
                    if (isCloseToBottom(nativeEvent) && !refreshing)
                        getGroupSpecificContent(
                            null,
                            null,
                            false,
                            SELECTED_GROUP.id
                        );
                }}>
                {
                    //#region Challenge Box
                }
                <Challenge
                    style={{
                        marginTop: style.defaultMmd,
                        marginBottom: style.defaultMsm,
                        marginHorizontal: style.defaultMmd * 2,

                        // Shadow
                        shadowColor: "#8829ac",
                        shadowRadius: 15,
                        shadowOpacity: 0.8,
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        backgroundColor: style.colors.black,
                        borderRadius: 10,
                    }}
                />

                {
                    //#region Calendar
                }
                {CALENDAR_ENABLED ? (
                    <View
                        style={{
                            marginTop: style.defaultMmd,
                            marginBottom: style.defaultMmd,
                            marginHorizontal: style.defaultMmd * 2,
                        }}>
                        <Calendar />
                    </View>
                ) : null}

                {
                    //#region Banner Mapping
                }
                {bannerData.map((banner, key) => (
                    <Banner
                        key={key}
                        id={banner}
                        style={{
                            marginTop: style.defaultMmd,
                            marginHorizontal: style.defaultMmd * 2,
                            marginBottom: style.defaultMsm,

                            // Shadow
                            shadowColor: style.colors.red,
                            shadowRadius: 15,
                            shadowOpacity: 0.5,
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            backgroundColor: style.colors.black,
                            borderRadius: 10,
                        }}
                    />
                ))}

                {
                    //#region Content Mapping
                }
                {contentData.map((item, key) =>
                    item.type === 0 ? (
                        <Post
                            key={key}
                            id={item.id}
                            style={{
                                marginVertical: style.defaultMmd,
                                zIndex: 10,
                            }}
                            likeable={SELECTED_GROUP.id === 2}
                            group={
                                !(
                                    SELECTED_GROUP.id == 0 ||
                                    SELECTED_GROUP.id == 1
                                )
                            }
                            onPress={() =>
                                navigation.navigate("postView", {
                                    id: item.id,
                                })
                            }
                            onCommentPress={id =>
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
                    ) : (
                        <Event
                            key={key}
                            id={item.id}
                            group={
                                !(
                                    SELECTED_GROUP.id == 0 ||
                                    SELECTED_GROUP.id == 1
                                )
                            }
                            onPress={() =>
                                navigation.navigate("eventView", {
                                    id: item.id,
                                })
                            }
                        />
                    )
                )}

                {
                    //#region End-Of-Page Text Hint
                }
                <Text
                    style={[
                        style.tWhite,
                        style.TsmRg,
                        style.tCenter,
                        { marginVertical: style.defaultMmd },
                    ]}>
                    {getLangs("landing_nocontenttext")}
                </Text>
            </ScrollView>
        </View>
    );
}

//#region onScrollEvents
const isOnTop = ({ contentOffset }) => {
    const paddingToTop = 25;
    return contentOffset.y < paddingToTop;
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    // return false;
    const paddingToBottom = 500;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};
//#endregion
