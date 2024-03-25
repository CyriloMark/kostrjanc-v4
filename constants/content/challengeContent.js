// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

// import Constants
import getAMTs, { AMTs } from "./getContentAmts";
import {
    filterPostsAndEvents,
    sortIds_InsertionSort,
} from "./filterPostsAndEvents";

let safedPosts = [];

/**
 * Gets User-Specific Content for Group
 * @param {Object[]} prevContentPosts Previous showing Posts
 * @param {boolean} loadNew true if Content Data of Group needs to get fetched new
 * @returns {Object[]} Showing Content of Group
 */
export default async function handleChallengeContent(
    challengeContentData,
    prevContentPosts,
    loadNew
) {
    console.log("handleChallengeContent");

    const db = ref(getDatabase());

    // Load correct Amount of Contents
    await getAMTs();
    // set Amount of Showing Posts per Loading
    const POST_AMT = AMTs[0];

    let postsList = safedPosts;

    if (loadNew) postsList = await getChallengePosts(db);

    if (postsList === null) return [];

    // Filter Duplicate Posts
    filterPostsAndEvents(
        {
            posts: postsList,
            events: [],
        },
        {
            posts: prevContentPosts,
            events: [],
        }
    );

    // Filter
    getCurrentPosts(postsList, POST_AMT, loadNew);

    // Update showing Lists
    prevContentPosts.push(...postsList);

    return modifyIdsToObject(postsList);
}

/**
 *
 * @param {String} db Reference to Firebase Database
 * @returns {number[] | null}Posts List
 */
const getChallengePosts = async db =>
    (await get(child(db, `groups/2/posts`))).val();

/**
 * Modifies `postsList` to the most recent posts and sets the other to safedPosts
 * @param {number[]} postsList List of Post Ids
 * @param {number} amt Amount of Posts that should be returned
 */
function getCurrentPosts(postsList, amt) {
    safedPosts = postsList.reverse().splice(amt).reverse();
    safedPosts.reverse();
}

/**
 *
 * @param {number[]} postsList List of Post Ids
 * @returns {Object[]} Output List of Posts
 */
function modifyIdsToObject(postsList) {
    let output = [];
    postsList.forEach(id => output.push({ id: id, type: 0 }));
    return output;
}
