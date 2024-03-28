// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

// import Constants
import getAMTs, { AMTs } from "./getContentAmts";
import {
    filterPostsAndEvents,
    sortIds_InsertionSort,
} from "./filterPostsAndEvents";
import { setCachedContentData } from "./contentCacheLoader";

/**
 * Gets User-Specific Content for Group
 * @param {Object} group Current Selected Group
 * @param {Object[]} prevContentPosts Previous showing Posts
 * @param {Object[]} prevContentEvents Previous showing Events
 * @param {boolean} loadNew true if Content Data of Group needs to get fetched new
 * @returns {Object[]} Showing Content of Group
 */
export default async function handleGroupContent(
    group,
    prevContentPosts,
    prevContentEvents,
    loadNew
) {
    console.log("handleGroupContent", loadNew);

    const currentDate = Date.now();

    // Load correct Amount of Contents
    await getAMTs();

    // Set over-all Amount of each Content-Type
    const POST_AMT = AMTs[0];
    const EVENT_AMT = AMTs[2];

    const contentData = {
        posts: group.posts ? group.posts : [],
        events: group.events ? group.events : [],
    };

    // When new fetch of Content-Data is needed [loadNew == true]
    if (loadNew) {
        await getGroupContentData(contentData, group.id);
        await removeObsoleteEvents(contentData.events, currentDate);
    }

    filterPostsAndEvents(contentData, {
        posts: prevContentPosts,
        events: prevContentEvents,
    });

    const usingContentData = {
        posts: getCurrentPosts(contentData.posts, POST_AMT),
        events: getCurrentEvents(contentData.events, EVENT_AMT),
    };

    // Update showing Lists
    prevContentPosts.push(...usingContentData.posts);
    prevContentEvents.push(...usingContentData.events);

    return combineContent(usingContentData, group.id);
}

/**
 * Get Posts and Events from Group
 * @param {Object} data Object with Post and Event Ids as child
 * @param {String} id Group Id
 * @returns Object with posts and events Child; with Ids
 */
async function getGroupContentData(data, id) {
    let output = {
        posts: [],
        events: [],
    };

    await get(child(ref(getDatabase()), `groups/${id}/posts`))
        .then(postsSnap => {
            if (postsSnap.exists()) output.posts = postsSnap.val();
        })
        .catch(error =>
            console.log(
                "error in constants/content/groupContent",
                "getGroupContentData get posts",
                error.code
            )
        );
    await get(child(ref(getDatabase()), `groups/${id}/events`))
        .then(eventsSnap => {
            if (eventsSnap.exists()) output.events = eventsSnap.val();
        })
        .catch(error =>
            console.log(
                "error in constants/content/groupContent",
                "getGroupContentData get events",
                error.code
            )
        );

    data = output;
}

/**
 * Returns most recent Posts not showing yet
 * @param {number[]} postsList List of Post Ids
 * @param {number} amt Amount of Posts that should be returned
 * @returns
 */
function getCurrentPosts(postsList, amt) {
    let bound = postsList.length - amt;
    if (bound < 0) bound = 0;

    return postsList.splice(
        //   It removes the last amt Elements of the Group Post List,
        bound //  if I need to reuse the last Elements than use Array.slice() instead.
    );
}

/**
 * Returns most recent Events not showing yet
 * @param {number[]} eventsList List of Event Ids
 * @param {number} amt Amount of Events that should be returned
 * @returns
 */
function getCurrentEvents(eventsList, amt) {
    let bound = eventsList.length - amt;
    if (bound < 0) bound = 0;

    return eventsList.splice(bound); // Like getCurrentPosts()
}

/**
 * Filters all obsolete Events (All Events with Ending Time < Date.now())
 * @param {number[]} eventsList Array of Event Ids
 * @param {number} currentDate Current Date
 */
async function removeObsoleteEvents(eventsList, currentDate) {
    let obsoleteEvents = [];

    for (let i = 0; i < eventsList.length; i++)
        await get(child(ref(getDatabase()), `events/${eventsList[i]}/ending`))
            .then(startingSnap => {
                if (startingSnap.exists())
                    if (startingSnap.val() < currentDate)
                        obsoleteEvents.push(eventsList[i]);
            })
            .catch(error =>
                console.log(
                    "error in constants/content/groupContent.js",
                    "removeObsoleteEvents get",
                    error.code
                )
            );

    for (let i = eventsList.length - 1; i >= 0; i--)
        if (eventsList[i] == obsoleteEvents[obsoleteEvents.length - 1]) {
            eventsList.splice(i, 1);
            obsoleteEvents.pop();
        }
}

/**
 * Combines Content
 * @param {Object} usingContentData Object with Posts and Events Ids as childs
 * @returns {Object[]}
 */
function combineContent(usingContentData, groupId) {
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

    // setCachedContentData(groupId, finalContentList);

    return finalContentList;
}
