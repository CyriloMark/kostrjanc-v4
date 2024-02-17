// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

// import Constants
import getAMTs, { AMTs } from "./getContentAmts";
import {
    filterPostsAndEvents,
    mergeSortRandomly,
    sortIds_InsertionSort,
} from "./filterPostsAndEvents";
import { filterDuplicateUsers, filterUsers } from "./filterUsers";
import { getData } from "../storage";
import quicksort from "./contentSort";

const safedContent = {
    posts: [],
    events: [],
};

const checkedUserContent = {
    posts: [],
    events: [],
};

export default async function handleGeneralContent(
    user,
    prevContentPosts,
    prevContentEvents
) {
    console.log("handleGeneralContent");

    // Firebase Database Connection
    const db = ref(getDatabase());

    const currentDate = Date.now();
    const userData = user ? user : await getData("userData");

    // Load correct Amount of Contents
    await getAMTs();

    const contentData = {
        posts: [],
        events: [],
    };

    // Set over-all Amount of each Content-Type
    const POST_AMT = AMTs[0];
    const POST_RANDOM_AMT = AMTs[1];
    const EVENT_AMT = AMTs[2];
    const EVENT_RANDOM_AMT = AMTs[3];

    // Lists of Client Following and filter
    let followingList = userData.following;
    followingList = filterDuplicateUsers(followingList);

    // let a = [1, 2, 3, 4, 5, 6];
    // let b = a.splice(-1);
    // console.log(a, b);

    await getPosts(
        POST_AMT,
        POST_RANDOM_AMT,
        followingList,
        contentData.posts,
        prevContentPosts,
        db
    );
    await getEvents(
        EVENT_AMT,
        EVENT_RANDOM_AMT,
        followingList,
        contentData.events,
        prevContentEvents,
        currentDate,
        db
    );

    return combineContent(contentData);
}

/**
 *
 * @param {number} amt Total Amount of Posts
 * @param {number} amtRandom Amound of Random Posts
 * @param {String[]} userList Array of User Ids to fetch
 * @param {number[]} postList Array of Post Ids
 * @param {number[]} prevContentPosts Array of Post Ids previously used
 * @param {*} db Reference to Firebase Database
 */
async function getPosts(
    amt,
    amtRandom,
    userList,
    postList,
    prevContentPosts,
    db
) {
    // Filter used Users => List of new Users
    const followingListFiltered = filterUsers(
        userList,
        checkedUserContent.posts
    );

    const AMT_UserRelatedPosts = amt - amtRandom;

    let limited = false;
    if (safedContent.posts.length >= AMT_UserRelatedPosts) limited = true;

    // If Limited, then we go straight to fetching of Random Content
    if (
        limited ||
        followingListFiltered.length ==
            0 /*    We also check if followingUserList is empty =>
                    then we can not get any new Following User related Content =>
                    we also fetch straight Random Content */
    ) {
        // We dont need to sort the Content, because safedContent Lists are already sorted
        let pList = safedContent.posts.splice(
            safedContent.posts.length - AMT_UserRelatedPosts
        );
        postList.push(...pList);
    } else {
        // If we want to limit later on the amount of user fetches I add now the variable override
        const limitedUserList = followingListFiltered;

        // Fetch throw every User and get the Post List
        for (let i = 0; i < limitedUserList.length; i++)
            postList.push(...(await fetchUserPosts(limitedUserList[i], db)));

        // Update Checked Users List
        checkedUserContent.posts.push(...limitedUserList);

        // Sort List and safe
        quicksort(postList, 0, postList.length - 1);

        // Splice to needed Amount
        safedContent.posts = postList.reverse().splice(amt);
        safedContent.posts.reverse();
        postList.reverse();
    }

    // Get Random Posts
    let correctAmt = amt - postList.length;
    const randomPosts = await handleRandomPosts(
        correctAmt,
        prevContentPosts,
        db
    );

    // Merge both Lists together
    mergeSortRandomly(postList, randomPosts);
}

/**
 *
 * @param {number} amt Total Amount of Events
 * @param {number} amtRandom Amound of Random Events
 * @param {String[]} userList Array of User Ids to fetch
 * @param {number[]} eventList Array of Post Ids
 * @param {number[]} prevContentEvents Array of Events Ids previously used
 * @param {number} currentDate Current Date in UTC+1
 * @param {*} db Reference to Firebase Database
 */
async function getEvents(
    amt,
    amtRandom,
    userList,
    eventList,
    prevContentEvents,
    currentDate,
    db
) {
    // Filter used Users => List of new Users
    const followingListFiltered = filterUsers(
        userList,
        checkedUserContent.events
    );

    const AMT_UserRelatedEvents = amt - amtRandom;

    let limited = false;
    if (safedContent.events.length >= AMT_UserRelatedEvents) limited = true;

    // If Limited, then we go straight to fetching of Random Content
    if (
        limited ||
        followingListFiltered.length ==
            0 /*    We also check if followingUserList is empty =>
                    then we can not get any new Following User related Content =>
                    we also fetch straight Random Content */
    ) {
        // We dont need to sort the Content, because safedContent Lists are already sorted
        let eList = safedContent.events.splice(
            safedContent.events.length - AMT_UserRelatedEvents
        );
        eventList.push(...eList);
    } else {
        // If we want to limit later on the amount of user fetches I add now the variable override
        const limitedUserList = followingListFiltered;

        // Fetch throw every User and get the Events List
        for (let i = 0; i < limitedUserList.length; i++)
            eventList.push(
                ...(await fetchUserEvents(limitedUserList[i], currentDate, db))
            );

        // Update Checked Users List
        checkedUserContent.events.push(...limitedUserList);

        // Sort List and safe
        quicksort(eventList, 0, eventList.length - 1);

        // Splice to needed Amount
        safedContent.events = eventList.reverse().splice(amt);
        safedContent.events.reverse();
        eventList.reverse();
    }

    // Get Random Events
    let correctAmt = amt - eventList.length;
    const randomEvents = await handleRandomEvents(
        correctAmt,
        prevContentEvents,
        db
    );

    // Merge both Lists together
    mergeSortRandomly(eventList, randomEvents);
}

/**
 * Fetches Post List of User
 * @param {number} userId Id of User
 * @param {*} db Reference to Firebase Database
 * @returns {number[]} Array of Users Posts
 */
async function fetchUserPosts(userId, db) {
    let output = [];
    await get(child(db, `users/${userId}/posts`))
        .then(snap => {
            if (snap.exists()) output = snap.val();
        })
        .catch(error =>
            console.log(
                "error in constants/content/generalContent.js",
                "fetchUserPosts",
                error.code
            )
        );
    return output;
}

/**
 * Fetches Event List of User
 * @param {number} userId Id of User
 * @param {*} db Reference to Firebase Database
 * @returns {number[]} Array of Users Events
 */
async function fetchUserEvents(userId, currentDate, db) {
    let output = [];
    await get(child(db, `users/${userId}/events`))
        .then(async snap => {
            if (snap.exists()) {
                //#region Check if Event is not obsolete
                const events = snap.val();

                for (let i = 0; i < events.length; i++)
                    await get(child(db, `events/${events[i]}/ending`))
                        .then(endingSnap => {
                            if (endingSnap.exists())
                                if (endingSnap.val() > currentDate)
                                    output.push(events[i]);
                        })
                        .catch(error =>
                            console.log(
                                "error in constants/content/generalContent.js",
                                "fetchUserEvents get Event Ending",
                                error.code
                            )
                        );
                //#endregion
            }
        })
        .catch(error =>
            console.log(
                "error in constants/content/generalContent.js",
                "fetchUserEvents",
                error.code
            )
        );
    return output;
}

async function handleRandomPosts(amt, prevContentPosts, db) {
    return [];
}

async function handleRandomEvents(amt, prevContentEvents, db) {
    return [];
}

/**
 * Combines Content
 * @param {Object} usingContentData Object with Posts and Events Ids as childs
 * @returns {Object[]}
 */
function combineContent(usingContentData) {
    // Idea: Sort Posts and Events by publish Data

    let finalContentList = [];
    for (let i in usingContentData.posts)
        finalContentList.push({
            id: usingContentData.posts[i],
            type: 0,
        });
    for (let i in usingContentData.events)
        finalContentList.push({
            id: usingContentData.events[i],
            type: 1,
        });

    sortIds_InsertionSort(finalContentList, "id");

    return finalContentList;
}
