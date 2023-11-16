import React, { useState, useCallback, useEffect } from "react";
import {
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

import * as style from "../../styles";

// import Constants
import { wait } from "../../constants/wait";
import { getData, storeData } from "../../constants/storage";
import { User_Placeholder } from "../../constants/content/PlaceholderData";
import {
    lerp,
    openLink,
    sortArrayByDateFromUnderorderedKey,
} from "../../constants";
import { getLangs } from "../../constants/langs";
import { checkIfTutorialNeeded } from "../../constants/tutorial";
import makeRequest from "../../constants/request";

import { getAuth } from "firebase/auth";
import { get, ref, getDatabase, child } from "firebase/database";

// import Components
import AppHeader from "../../components/landing/AppHeader";
import Post from "../../components/cards/Post";
import Event from "../../components/cards/Event";
import Banner from "../../components/cards/Banner";
import Refresh from "../../components/RefreshControl";
import WarnButton from "../../components/settings/WarnButton";

import Loading from "../static/Loading";

let AMTs = [0, 0, 0, 0, false];
let showingContent = [];

let checkedUsersList = [];

let safedPosts = [];
let safedRandomPosts = [];
let safedEvents = [];
let safedRandomEvents = [];

let LOADING = false;

const UPDATE_COOLDOWN = 1000;
let LAST_UPDATED = 0;

export default function Landing({ navigation, onTut }) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        loadUser();
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const [user, setUser] = useState(User_Placeholder);

    const [loading, setLoading] = useState(true);

    const [contentData, setContentData] = useState({
        banners: [],
        content: [],
    });

    const loadUser = async () => {
        const id = getAuth().currentUser.uid;
        storeData("userId", id);

        showingContent = [];
        safedPosts = [];
        safedEvents = [];
        LAST_UPDATED = 0;

        const db = getDatabase();
        get(child(ref(db), "users/" + id))
            .then(userSnap => {
                if (!userSnap.exists()) return;
                const userData = userSnap.val();

                // Man könnte hier ban abfragen
                setUser(userData);
                storeData("userData", userData);

                ULTIMATIVE_ALGORITHM(id, userData, true);
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
        setLoading(true);
        loadUser();
        checkForTutorial();
    }, []);

    const checkForTutorial = async () => {
        const needTutorial = await checkIfTutorialNeeded(0);
        if (needTutorial) onTut(0);
    };

    /**
     * OBSOLETE
     * @param {string} _id User Id |Can be delivered directly
     * @param {*} user UserData | Can be delivered directly
     * @param {boolean} updateBanners true when Banners need to get updated
     * @returns
     */
    async function ULTIMATIVE_ALGORITHM(_id, user, updateBanners) {
        if (LOADING) return;
        LOADING = true;

        const currentDate = Date.now();
        const db = ref(getDatabase());

        const uid = _id ? _id : await getData("userId");
        const userData = user ? user : await getData("userData");

        // Amounts of Content 0: posts; 1: events; (2: ads);
        if (!AMTs[4])
            await get(child(db, `AMT_post-event-ad`))
                .then(amtsSnap => {
                    if (amtsSnap.exists()) AMTs = [...amtsSnap.val(), true];
                    else return;
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "ultimate_algo get amts",
                        error.code
                    )
                );

        //#region Banners
        if (updateBanners) {
            get(child(db, `banners`))
                .then(bannersSnap => {
                    if (bannersSnap.exists()) {
                        let outputBanners = [];
                        bannersSnap.forEach(banner => {
                            if (
                                banner.val().ending > currentDate &&
                                banner.val().starting < currentDate
                            )
                                outputBanners.push(banner.key);
                        });
                        setContentData(prev => {
                            return {
                                ...prev,
                                banners: outputBanners,
                            };
                        });
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "ultimate_algo get banners",
                        error.code
                    )
                );
        }
        //#endregion

        //#region Follower/-ing list
        if (!userData.follower && !userData.following) {
            console.log("no follower/-ing");
            setLoading(false);
            LOADING = false;
            return;
        }

        let clientFolloweringListUnsorted = userData.follower
            ? userData.follower.concat(
                  userData.following ? userData.following : []
              )
            : userData.following;
        const clientFolloweringList = clientFolloweringListUnsorted.filter(
            function (item, pos) {
                return clientFolloweringListUnsorted.indexOf(item) == pos;
            }
        );
        //#endregion

        //#region Contents
        let followeringContentList = [];
        let checkedRandomUsers = [];
        let checkedPEUsers = [];

        let amtOfNewContentSearch = 0;

        for (let i = 0; i < clientFolloweringList.length; i++) {
            await get(child(db, `users/${clientFolloweringList[i]}/posts`))
                .then(fPostsSnap => {
                    if (fPostsSnap.exists()) {
                        const fPOutput = [];
                        fPostsSnap.forEach(p => {
                            fPOutput.push({
                                id: p.val(),
                                type: 0,
                            });
                        });
                        followeringContentList = [
                            ...followeringContentList,
                            ...fPOutput,
                        ];
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "ultimate algo get followeringlist posts",
                        error.code
                    )
                );
            await get(child(db, `users/${clientFolloweringList[i]}/events`))
                .then(fEventsSnap => {
                    if (fEventsSnap.exists()) {
                        const fEOutput = [];
                        fEventsSnap.forEach(e => {
                            fEOutput.push({
                                id: e.val(),
                                type: 1,
                            });
                        });
                        followeringContentList = [
                            ...followeringContentList,
                            ...fEOutput,
                        ];
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "ultimate algo get followeringlist events",
                        error.code
                    )
                );

            if (i === clientFolloweringList.length - 1) sortContent();
        }

        function sortContent() {
            const followeringContentSortedList =
                sortArrayByDateFromUnderorderedKey(
                    followeringContentList,
                    "id"
                ).filter(function (item) {
                    if (showingContent.length === 0) return true;
                    for (let i = 0; i < showingContent.length; i++)
                        if (showingContent[i].id === item.id) return false;
                    return true;
                });
            const currentPList = followeringContentSortedList
                .filter(item => item.type === 0)
                .slice(0, AMTs[0]);
            const currentEList = followeringContentSortedList
                .filter(item => item.type === 1)
                .slice(0, AMTs[1]);

            const finalFolloweringList = sortArrayByDateFromUnderorderedKey(
                currentPList.concat(currentEList),
                "id"
            );

            if (
                currentPList.length === AMTs[0] &&
                currentEList.length === AMTs[1]
            ) {
                setContentData(prev => {
                    return {
                        ...prev,
                        content: [...showingContent, ...finalFolloweringList],
                    };
                });
                showingContent = [...showingContent, ...finalFolloweringList];
                setLoading(false);
                LOADING = false;
            } else {
                amtOfNewContentSearch = 0;
                checkedPEUsers = clientFolloweringList;
                getClientUnbasedContent(
                    finalFolloweringList,
                    currentPList,
                    currentEList,
                    []
                );
            }
        }

        async function getClientUnbasedContent(
            clientBasedContent,
            usedPosts,
            usedEvents,
            clientUnbasedContent
        ) {
            //#region Get Random Person based on Followering
            let randomUserList = [];
            const clientFolloweringFilteredList = clientFolloweringList.filter(
                user => !checkedRandomUsers.includes(user)
            );
            if (clientFolloweringFilteredList.length === 0) {
                console.log("no users left");
                return;
            }
            const randomFolloweringOfClient =
                clientFolloweringFilteredList[
                    Math.round(
                        lerp(
                            0,
                            clientFolloweringFilteredList.length - 1,
                            Math.random()
                        )
                    )
                ];
            checkedRandomUsers.push(randomFolloweringOfClient);

            await get(child(db, `users/${randomFolloweringOfClient}`))
                .then(userSnap => {
                    if (userSnap.exists()) {
                        const userData = userSnap.val();

                        let users = [];
                        if (userSnap.hasChild("follower"))
                            users.push(...userData.follower);
                        if (userSnap.hasChild("following"))
                            users.push(...userData.following);

                        users
                            .filter(user => user !== uid)

                            .filter(function (item, pos) {
                                return users.indexOf(item) == pos;
                            })
                            .filter(
                                user => !clientFolloweringList.includes(user)
                            )
                            .filter(user => !checkedPEUsers.includes(user))
                            .forEach(user => randomUserList.push(user));
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "getClientUnbasedContent get randomFolloweingOfClient Data",
                        error.code
                    )
                );
            //#endregion

            let usersPosts = [];
            if (usedPosts.length < AMTs[0]) {
                for (let i = 0; i < randomUserList.length; i++) {
                    await get(child(db, `users/${randomUserList[i]}/posts`))
                        .then(rPostsSnap => {
                            if (rPostsSnap.exists()) {
                                const rPOutput = [];
                                rPostsSnap.forEach(p => {
                                    rPOutput.push({
                                        id: p.val(),
                                        type: 0,
                                    });
                                });
                                usersPosts.push(
                                    ...rPOutput.filter(function (item) {
                                        if (showingContent.length === 0)
                                            return true;
                                        for (
                                            let i = 0;
                                            i < showingContent.length;
                                            i++
                                        )
                                            if (
                                                showingContent[i].id === item.id
                                            )
                                                return false;
                                        return true;
                                    })
                                );
                            }
                        })
                        .catch(error =>
                            console.log(
                                "error pages/main/Landing.jsx",
                                "ultimate algo getClientUnbasedContent get posts events",
                                error.code
                            )
                        );
                }
            }

            let usersEvents = [];
            if (usedEvents.length < AMTs[1]) {
                for (let i = 0; i < randomUserList.length; i++) {
                    await get(child(db, `users/${randomUserList[i]}/events`))
                        .then(rEventsSnap => {
                            if (rEventsSnap.exists()) {
                                const rEOutput = [];
                                rEventsSnap.forEach(e => {
                                    rEOutput.push({
                                        id: e.val(),
                                        type: 1,
                                    });
                                });
                                usersEvents.push(
                                    ...rEOutput.filter(function (item) {
                                        if (showingContent.length === 0)
                                            return true;
                                        for (
                                            let i = 0;
                                            i < showingContent.length;
                                            i++
                                        )
                                            if (
                                                showingContent[i].id === item.id
                                            )
                                                return false;
                                        return true;
                                    })
                                );
                            }
                        })
                        .catch(error =>
                            console.log(
                                "error pages/main/Landing.jsx",
                                "ultimate algo getClientUnbasedContent get events events",
                                error.code
                            )
                        );
                }
            }

            const outputContent = clientUnbasedContent.concat([
                ...usersPosts,
                ...usersEvents,
            ]);

            const combinedPosts = usersPosts.concat(usedPosts);
            const combinedEvents = usersEvents.concat(usedEvents);

            if (
                combinedPosts.length >= AMTs[0] &&
                combinedEvents.length >= AMTs[1]
            ) {
                const sortedPosts = sortArrayByDateFromUnderorderedKey(
                    combinedPosts,
                    "id"
                ).slice(0, AMTs[0]);
                const sortedEvents = sortArrayByDateFromUnderorderedKey(
                    combinedEvents,
                    "id"
                ).slice(0, AMTs[1]);

                const finalRandomList = sortArrayByDateFromUnderorderedKey(
                    sortedPosts.concat(sortedEvents),
                    "id"
                );

                setContentData(prev => {
                    return {
                        ...prev,
                        content: [...showingContent, ...finalRandomList],
                    };
                });
                showingContent = [...showingContent, ...finalRandomList];

                setLoading(false);
                LOADING = false;
            } else {
                if (
                    clientFolloweringFilteredList.length !== 1 &&
                    amtOfNewContentSearch < 10
                ) {
                    amtOfNewContentSearch++;
                    getClientUnbasedContent(
                        clientBasedContent,
                        // usersPosts.concat(...usedPosts)
                        combinedPosts,
                        combinedEvents,
                        outputContent
                    );
                } else {
                    const sortedPosts = sortArrayByDateFromUnderorderedKey(
                        combinedPosts,
                        "id"
                    ).slice(0, AMTs[0]);
                    const sortedEvents = sortArrayByDateFromUnderorderedKey(
                        combinedEvents,
                        "id"
                    ).slice(0, AMTs[1]);

                    const finalRandomList = sortArrayByDateFromUnderorderedKey(
                        sortedPosts.concat(sortedEvents),
                        "id"
                    );

                    setContentData(prev => {
                        return {
                            ...prev,
                            content: [...showingContent, ...finalRandomList],
                        };
                    });
                    showingContent = [...showingContent, ...finalRandomList];
                    setLoading(false);
                    LOADING = false;
                }
            }
        }

        //#endregion
    }

    async function ULTIMATIVE_ALGORITHM_new(_id, user, updateBanners) {
        //#region Loading Screen and avoid multiple calls
        if (LAST_UPDATED > Date.now() - UPDATE_COOLDOWN) return;
        if (LOADING) return;
        LOADING = true;
        //#endregion

        console.log("ULTIMATIVE_ALGORITHM");

        // Firebase Database Connection
        const db = ref(getDatabase());

        const currentDate = Date.now();
        const uid = _id ? _id : await getData("userId");
        const userData = user ? user : await getData("userData");

        let hasPosts = false;
        let hasEvents = false;

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
                        "ultimate_algo get amts",
                        error.code
                    )
                );
        //#endregion

        //#region load Banners when updateBanners == true
        if (updateBanners) {
            get(child(db, `banners`))
                .then(bannersSnap => {
                    if (bannersSnap.exists()) {
                        let outputBanners = [];
                        //#region Check if Banners are in Time
                        bannersSnap.forEach(banner => {
                            if (
                                banner.val().ending > currentDate &&
                                banner.val().starting < currentDate
                            )
                                outputBanners.push(banner.key);
                        });
                        //#endregion
                        // Set Banners to Final Data
                        setContentData(prev => {
                            return {
                                ...prev,
                                banners: outputBanners,
                            };
                        });
                        // setLoading(false);
                        // LOADING = false;
                    }
                })
                .catch(error =>
                    console.log(
                        "error pages/main/Landing.jsx",
                        "ultimate_algo get banners",
                        error.code
                    )
                );
        }
        //#endregion

        //#region load Following List
        // Return nothing, when user does not have any Followings
        if (!userData.following) {
            console.log("no following");
            setLoading(false);
            LOADING = false;
            return;
        }

        let clientHasFollowings = userData.following;

        // Lists of Client Following
        let clientFollowingList = clientHasFollowings ? userData.following : [];
        //#endregion

        let finalPostsList = [];
        let finalEventsList = [];
        getClientPosts();
        getClientEvents();

        //#region Get Posts
        async function getClientPosts() {
            let postsList = safedPosts;

            const clientFollowingListFiltered = filterUsedUsers(
                clientFollowingList,
                checkedUsersList
            );

            console.log(
                "clientFollowingListFiltered",
                // clientFollowingListFiltered
                checkedUsersList
            );

            // if there are safed Posts limited = true | don't need to fetch new Posts
            let limited = false;
            if (postsList.length >= AMTs[0] - AMTs[2]) limited = true;

            if (limited) {
                const POST_AMT = AMTs[0] - AMTs[2];

                const postsSortedList = sortArrayByDateFromUnderorderedKey(
                    postsList,
                    "id"
                );
                finalPostsList = postsSortedList.slice(0, POST_AMT);
                safedPosts = postsSortedList.slice(POST_AMT);

                if (hasEvents) combinePostsAndEvents();
                else hasPosts = true;
            }

            for (
                let i = 0;
                i < limited ? 0 : clientFollowingListFiltered.length;
                i++
            ) {
                await get(
                    child(db, `users/${clientFollowingListFiltered[i]}/posts`)
                )
                    .then(pSnap => {
                        if (pSnap.exists())
                            pSnap.forEach(p => {
                                if (!checkForDuplicates(postsList, p.val())) {
                                    postsList = [
                                        ...postsList,
                                        {
                                            id: p.val(),
                                            type: 0,
                                        },
                                    ];
                                }
                            });
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ULTIMATIVE_ALGORITHM getNewPosts",
                            error.code
                        )
                    );

                if (i === clientFollowingListFiltered.length - 1) {
                    updateCheckedUsersList(...clientFollowingListFiltered);

                    const POST_AMT = AMTs[0] - AMTs[2];
                    const postsSortedList = sortArrayByDateFromUnderorderedKey(
                        postsList,
                        "id"
                    );
                    safedPosts = postsSortedList.slice(POST_AMT);

                    if (postsList.length < POST_AMT) {
                        const missingAmt = AMTs[0] - postsList.length;
                        const randomPosts = await getRandomPosts(missingAmt);

                        finalPostsList = postsSortedList.concat(randomPosts);

                        if (hasEvents) combinePostsAndEvents();
                        else hasPosts = true;
                    } else {
                        const clientPostsList = postsSortedList.slice(
                            0,
                            POST_AMT
                        );

                        const randomPosts = await getRandomPosts(AMTs[1]);

                        finalPostsList = clientPostsList.concat(randomPosts);

                        if (hasEvents) combinePostsAndEvents();
                        else hasPosts = true;
                    }
                }
            }
        }
        //#endregion

        //#region Get Events
        async function getClientEvents() {
            let eventsList = safedEvents;

            const clientFollowingListFiltered = filterUsedUsers(
                clientFollowingList,
                checkedUsersList
            );

            let limited = false;
            if (eventsList.length >= AMTs[1] - AMTs[3]) limited = true;

            if (limited) {
                const EVENT_AMT = AMTs[1] - AMTs[3];

                const eventsSortedList = sortArrayByDateFromUnderorderedKey(
                    eventsList,
                    "starting"
                );
                finalEventsList = eventsSortedList.slice(0, EVENT_AMT);

                safedEvents = eventsSortedList.slice(EVENT_AMT);

                if (hasPosts) combinePostsAndEvents();
                else hasEvents = true;
            }

            for (
                let i = 0;
                i < limited ? 0 : clientFollowingListFiltered.length;
                i++
            ) {
                await get(
                    child(db, `users/${clientFollowingListFiltered[i]}/events`)
                )
                    .then(eSnap => {
                        if (eSnap.exists())
                            eSnap.forEach(async e => {
                                if (!checkForDuplicates(eventsList, e.val())) {
                                    await get(
                                        child(db, `events/${e.val()}/starting`)
                                    )
                                        .then(startingSnap => {
                                            if (startingSnap.exists)
                                                eventsList = [
                                                    ...eventsList,
                                                    {
                                                        id: e.val(),
                                                        type: 1,
                                                        starting:
                                                            startingSnap.val(),
                                                    },
                                                ];
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error pages/main/Landing.jsx",
                                                "ULTIMATIVE_ALGORITHM getClientEvents get Event Starting",
                                                error.code
                                            )
                                        );
                                }
                            });
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ULTIMATIVE_ALGORITHM getClientEvents",
                            error.code
                        )
                    );

                if (i === clientFollowingListFiltered.length - 1) {
                    updateCheckedUsersList(clientFollowingListFiltered);

                    const EVENT_AMT = AMTs[1] - AMTs[3];
                    const eventsSortedList = sortArrayByDateFromUnderorderedKey(
                        eventsList,
                        "starting"
                    );
                    safedEvents = eventsSortedList.slice(EVENT_AMT);

                    if (eventsList.length < EVENT_AMT) {
                        const missingAmt = AMTs[1] - eventsList.length;
                        const randomEvents = await getRandomEvents(missingAmt);

                        finalEventsList = eventsSortedList.concat(randomEvents);

                        if (hasPosts) combinePostsAndEvents();
                        else hasEvents = true;
                    } else {
                        const clientEventsList = eventsSortedList.slice(
                            0,
                            EVENT_AMT
                        );

                        const randomEvents = await getRandomEvents(AMTs[3]);
                        finalEventsList = clientEventsList.concat(randomEvents);

                        if (hasPosts) combinePostsAndEvents();
                        else hasEvents = true;
                    }
                }
            }
        }
        //#endregion

        //#region getRandomPosts
        /**
         * Function that generates Posts of Random Users Client is not Following
         * @returns List of new Posts of Random Users
         */
        async function getRandomPosts(amt) {
            let postsList = safedRandomPosts;

            let randomUsersList = await getRandomUsers(10);
            if (randomUsersList.length === 0) return [];

            // if there are safed Posts limited = true | don't need to fetch new Posts
            let limited = false;
            if (postsList.length >= amt) limited = true;

            if (limited) {
                const postsSortedList = sortArrayByDateFromUnderorderedKey(
                    postsList,
                    "id"
                );
                finalPostsList = postsSortedList.slice(0, amt);

                safedRandomPosts = postsSortedList.slice(amt);
                return finalPostsList;
            }

            for (let i = 0; i < randomUsersList.length; i++) {
                await get(child(db, `users/${randomUsersList[i]}/posts`))
                    .then(pSnap => {
                        if (pSnap.exists())
                            pSnap.forEach(p => {
                                if (!checkForDuplicates(postsList, p.val())) {
                                    postsList = [
                                        ...postsList,
                                        {
                                            id: p.val(),
                                            type: 0,
                                        },
                                    ];
                                }
                            });
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ULTIMATIVE_ALGORITHM getRandomPosts",
                            error.code
                        )
                    );

                if (i === randomUsersList.length - 1) {
                    updateCheckedUsersList(randomUsersList);

                    const postsSortedList = sortArrayByDateFromUnderorderedKey(
                        postsList,
                        "id"
                    );
                    const outputPostsList = postsSortedList.slice(0, amt);

                    safedRandomPosts = postsSortedList.slice(amt);
                    return outputPostsList;
                }
            }
        }
        //#endregion

        //#region getRandomEvents
        /**
         * Function that generates Events of Random Users Client is not Following
         * @returns List of new Events of Random Users
         */
        async function getRandomEvents(amt) {
            let eventsList = safedRandomEvents;

            let randomUsersList = await getRandomUsers(10);
            if (randomUsersList.length === 0) return [];

            // if there are safed Posts limited = true | don't need to fetch new Posts
            let limited = false;
            if (eventsList.length >= amt) limited = true;

            if (limited) {
                const eventsSortedList = sortArrayByDateFromUnderorderedKey(
                    eventsList,
                    "starting"
                );
                const outputEventsList = eventsSortedList.slice(0, amt);
                safedRandomEvents = eventsSortedList.slice(amt);
                return outputEventsList;
            }

            for (let i = 0; i < randomUsersList.length; i++) {
                await get(child(db, `users/${randomUsersList[i]}/events`))
                    .then(eSnap => {
                        if (eSnap.exists())
                            eSnap.forEach(async e => {
                                if (!checkForDuplicates(eventsList, e.val())) {
                                    await get(
                                        child(db, `events/${e.val()}/starting`)
                                    )
                                        .then(startingSnap => {
                                            if (startingSnap.exists)
                                                eventsList = [
                                                    ...eventsList,
                                                    {
                                                        id: e.val(),
                                                        type: 1,
                                                        starting:
                                                            startingSnap.val(),
                                                    },
                                                ];
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error pages/main/Landing.jsx",
                                                "ULTIMATIVE_ALGORITHM getRandomEvents get Event Starting",
                                                error.code
                                            )
                                        );
                                }
                            });
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ULTIMATIVE_ALGORITHM getRandomEvents",
                            error.code
                        )
                    );

                if (i === randomUsersList.length - 1) {
                    updateCheckedUsersList(randomUsersList);

                    const eventsSortedList = sortArrayByDateFromUnderorderedKey(
                        eventsList,
                        "starting"
                    );
                    const outputEventsList = eventsSortedList.slice(0, amt);
                    safedRandomEvents = eventsSortedList.slice(amt);
                    return outputEventsList;
                }
            }
        }
        //#endregion

        //#region updateCheckedUsersList
        function updateCheckedUsersList(newContent) {
            // console.log("newContent", newContent);
            let newList = checkedUsersList;
            newList.push(newContent);

            filteredList = filterDuplicateUsers(newList);
            checkedUsersList = filteredList;
        }

        //#region filterDuplicateUsers
        function filterDuplicateUsers(list) {
            const uniqueIds = new Set();

            for (const id of list) uniqueIds.add(id);

            const uniqueIdsArray = [...uniqueIds];
            return uniqueIdsArray;
        }
        //#endregion
        //#endregion

        //#region getRandomUsers | Function to get a personalized User List Client is not Following
        async function getRandomUsers(maxAmt) {
            /*//#region  If API works use this
            const newUsers = await makeRequest("/algo/follower", {
                max_followers: maxAmt,
                max_out: maxAmt,
                previous_followers: checkedUsersList,
            });

            return newUsers;
            //#endregion*/

            if (uid === "BVKixOd9soY1lWArFChYWNI7ID22") return [];
            else if (uid === "2ERCiXsoT1VDrqbthJUa0OCmysi2")
                return [
                    "7f1HFO6HIAW6jioXhEkY4kNGGfs2",
                    "EvHwI4tVYtbPiPpdKZ9sD71F0q73",
                    "UznKeGyHdTX0MoVrSRH5hqn8bkV2",
                    "aWx8i9zMDPfkZTej1zN0TzfwwEF2",
                    "lV2Ad1A17vYONZkmEKrbg04dkwq1",
                    "wPozvkNuAhYNu34JnzW2dkkp95H2",
                ];
        }
        //#endregion

        //#region Combine Posts & Events
        function combinePostsAndEvents() {
            let newFinalContentList = finalPostsList;

            finalEventsList.forEach(e => {
                const rand = Math.random();
                const index = Math.round(
                    lerp(0, newFinalContentList.length, rand)
                );
                newFinalContentList.splice(index, 0, e);
            });

            showingContent = [...showingContent, ...newFinalContentList];
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

        //#region checkForDuplicates
        /**
         *
         * @param {*[]} list List to check id
         * @param {number} id id to find in list
         * @returns {boolean} true if id is found in list
         */
        function checkForDuplicates(list, id) {
            list.forEach(l => {
                if (l.id === id) return true;
            });
            return false;
        }
        //#endregion

        //#region filterUsedUsers
        /**
         *
         * @param {*[]} toFilter
         * @param {*[]} used
         * @returns {*[]} List of Users doesn't used before
         */
        function filterUsedUsers(toFilter, used) {
            let output = [];
            toFilter.forEach(l => {
                if (!used.includes(l)) output.push(l);
            });
            return output;
        }
        //#endregion
    }

    if (loading) return <Loading />;

    return (
        <View style={[style.container, style.bgBlack]}>
            <Pressable style={{ zIndex: 10 }}>
                <AppHeader
                    pbUri={user.pbUri}
                    onUserPress={() => navigation.navigate("userProfile")}
                    onContentPress={() => navigation.navigate("content")}
                    onCenterPress={loadUser}
                />
            </Pressable>

            <ScrollView
                style={[style.container, style.pH, style.oVisible]}
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                automaticallyAdjustKeyboardInsets
                automaticallyAdjustContentInsets
                snapToAlignment="center"
                snapToEnd
                scrollEventThrottle={16}
                refreshControl={
                    Platform.OS === "ios" ? (
                        <Refresh
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    ) : null
                }
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent))
                        if (!refreshing)
                            ULTIMATIVE_ALGORITHM(null, null, false);
                }}>
                {Platform.OS === "android" &&
                require("../../app.json").expo.android.package !==
                    "de.kostrjanc.kostrjanc" ? (
                    <WarnButton
                        text={"Nowa kostrjanc App"}
                        sub={
                            "Nowe wersije wot kostrjanc namakaš wot něk pod linkom."
                        }
                        onPress={() =>
                            openLink(
                                "https://play.google.com/store/apps/details?id=de.kostrjanc.kostrjanc"
                            )
                        }
                    />
                ) : null}

                {contentData.banners.map((banner, key) => (
                    <Banner
                        key={key}
                        id={banner}
                        style={{
                            marginTop: style.defaultMmd,
                            marginHorizontal: style.defaultMmd * 2,

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

                {contentData.content.map((item, key) =>
                    item.type === 0 ? (
                        <Post
                            key={key}
                            id={item.id}
                            onPress={() =>
                                navigation.navigate("postView", {
                                    id: item.id,
                                    // fromLinking: false,
                                    // linkingData: null,
                                })
                            }
                        />
                    ) : (
                        <Event
                            key={key}
                            id={item.id}
                            onPress={() =>
                                navigation.navigate("eventView", {
                                    id: item.id,
                                })
                            }
                        />
                    )
                )}
                <Text
                    style={[
                        style.tWhite,
                        style.TsmLt,
                        style.tCenter,
                        { marginVertical: style.defaultMmd },
                    ]}>
                    {getLangs("landing_nocontenttext")}
                </Text>
            </ScrollView>
        </View>
    );
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 1000;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};
