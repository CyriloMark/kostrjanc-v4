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
import { lerp, sortArrayByDateFromUnderorderedKey } from "../../constants";
import { getLangs } from "../../constants/langs";
import { checkIfTutorialNeeded } from "../../constants/tutorial";

import { getAuth } from "firebase/auth";
import { get, ref, getDatabase, child } from "firebase/database";

import AppHeader from "../../components/landing/AppHeader";
import Post from "../../components/cards/Post";
import Event from "../../components/cards/Event";
import Banner from "../../components/cards/Banner";
import Refresh from "../../components/RefreshControl";

import Loading from "../static/Loading";

let AMTs = [0, 0, 0, 0, false];
let showingContent = [];

let checkedUsersList = [];

let showingPosts = [];
let showingEvents = [];

let safedPosts = [];
let safedEvents = [];

let LOADING = false;

export default function Landing({ navigation, onTut }) {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);

        showingContent = [];
        safedPosts = [];
        safedEvents = [];

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
        AMTs = [0, 0, 0, false];

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
    async function ULTIMATIVE_ALGORITHM_old(_id, user, updateBanners) {
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

    async function ULTIMATIVE_ALGORITHM_2(_id, user, updateBanners) {
        //#region Loading Screen and avoid multiple calls
        if (LOADING) return;
        LOADING = true;
        //#endregion

        console.log("ULTIMATIVE_ALGORITHM", "\n", checkedUsersList.length);

        // Firebase Database Connection
        const db = ref(getDatabase());

        const currentDate = Date.now();
        const uid = _id ? _id : await getData("userId");
        const userData = user ? user : await getData("userData");

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

        //#region load Follower + Following List
        // Return nothing, when user does not have any Followers/Followings
        if (!userData.follower && !userData.following) {
            console.log("no follower/-ing");
            setLoading(false);
            LOADING = false;
            return;
        }

        let clientHasFollowers = userData.follower;
        let clientHasFollowings = userData.following;

        // Lists of Client Following-/Follower
        let clientFollowerList = clientHasFollowers ? userData.follower : [];
        let clientFollowingList = clientHasFollowings ? userData.following : [];
        //#endregion

        sortAndSafePosts(
            await getNewClientFollowingPosts(),
            getNewClientFollowerPosts
        );

        //#region Get Following Posts | getNewClientFollowingPosts
        async function getNewClientFollowingPosts() {
            if (!clientHasFollowings) return;

            let followingPostList = [];
            const clientFollowingsListFiltered = filterUsedUsers(
                clientFollowingList,
                checkedUsersList
            );

            if (clientFollowingsListFiltered.length === 0)
                return {
                    list: [],
                    users: [],
                };

            for (let i = 0; i < clientFollowingsListFiltered.length; i++) {
                await get(
                    child(db, `users/${clientFollowingsListFiltered[i]}/posts`)
                )
                    .then(fPostsSnap => {
                        if (fPostsSnap.exists()) {
                            fPostsSnap.forEach(p => {
                                if (
                                    !checkForDuplicates(
                                        followingPostList,
                                        p.val()
                                    )
                                ) {
                                    followingPostList = [
                                        ...followingPostList,
                                        {
                                            id: p.val(),
                                            type: 0,
                                        },
                                    ];
                                }
                            });
                        }
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ultimate algo get followinglist posts",
                            error.code
                        )
                    );

                if (i === clientFollowingsListFiltered.length - 1)
                    return {
                        list: followingPostList,
                        users: clientFollowingsListFiltered,
                    };
            }
        }
        //#endregion

        //#region Get Follower Posts | getNewClientFollowerPosts
        async function getNewClientFollowerPosts() {
            if (!clientHasFollowers) return;

            let followerPostList = [];
            const clientFollowersListFiltered = filterUsedUsers(
                clientFollowerList,
                checkedUsersList
            );

            if (clientFollowersListFiltered.length === 0)
                return {
                    list: [],
                    users: [],
                };

            for (let i = 0; i < clientFollowersListFiltered.length; i++) {
                await get(
                    child(db, `users/${clientFollowersListFiltered[i]}/posts`)
                )
                    .then(fPostsSnap => {
                        if (fPostsSnap.exists()) {
                            fPostsSnap.forEach(p => {
                                if (
                                    !checkForDuplicates(
                                        followerPostList,
                                        p.val()
                                    )
                                ) {
                                    followerPostList = [
                                        ...followerPostList,
                                        {
                                            id: p.val(),
                                            type: 0,
                                        },
                                    ];
                                }
                            });
                        }
                    })
                    .catch(error =>
                        console.log(
                            "error pages/main/Landing.jsx",
                            "ultimate algo get followerlist posts",
                            error.code
                        )
                    );

                if (i === clientFollowersListFiltered.length - 1)
                    return {
                        list: followerPostList,
                        users: clientFollowersListFiltered,
                    };
            }
        }
        //#endregion

        //#region sortAndSafePosts
        async function sortAndSafePosts(postList, next) {
            console.log(postList);
            checkedUsersList.push(...postList.users);

            const postsSortedList = sortArrayByDateFromUnderorderedKey(
                postList.list,
                "id"
            );
            const POST_AMT = AMTs[0] - AMTs[2];
            const slicedPostsList =
                POST_AMT > postsSortedList.length
                    ? postsSortedList
                    : postsSortedList.slice(POST_AMT);

            console.log("slicedPostsList", slicedPostsList);

            if (slicedPostsList.length === POST_AMT) {
                safedPosts.push(...postsSortedList.slice(POST_AMT));
                showingPosts.push(...slicedPostsList);
                setContentData(prev => {
                    return {
                        ...prev,
                        content: showingPosts,
                    };
                });
                setLoading(false);
                LOADING = false;
            } else {
                sortAndSafePosts(await next(), () => {
                    console.log("end");
                });
            }
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

    async function ULTIMATIVE_ALGORITHM(_id, user, updateBanners) {
        //#region Loading Screen and avoid multiple calls
        if (LOADING) return;
        LOADING = true;
        //#endregion

        // console.log("ULTIMATIVE_ALGORITHM");

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
                    checkedUsersList.push(...clientFollowingListFiltered);

                    const POST_AMT = AMTs[0] - AMTs[2];

                    if (postsList.length < POST_AMT)
                        console.log("random posts");
                    else {
                        const postsSortedList =
                            sortArrayByDateFromUnderorderedKey(postsList, "id");
                        finalPostsList = postsSortedList.slice(0, POST_AMT);

                        safedPosts = postsSortedList.slice(POST_AMT);

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
                    checkedUsersList.push(...clientFollowingListFiltered);

                    const EVENT_AMT = AMTs[1] - AMTs[3];

                    if (eventsList.length < EVENT_AMT)
                        console.log("random events");
                    else {
                        const eventsSortedList =
                            sortArrayByDateFromUnderorderedKey(
                                eventsList,
                                "starting"
                            );
                        finalEventsList = eventsSortedList.slice(0, EVENT_AMT);

                        safedEvents = eventsSortedList.slice(EVENT_AMT);

                        if (hasPosts) combinePostsAndEvents();
                        else hasEvents = true;
                    }
                }
            }
        }
        //#endregion

        //#region Combine Posts & Events
        function combinePostsAndEvents() {
            console.log("combinePostsAndEvents");

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
                {contentData.banners.map((banner, key) => (
                    <Banner
                        key={key}
                        id={banner}
                        style={{
                            marginTop: style.defaultMmd,
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
