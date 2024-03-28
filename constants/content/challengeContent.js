// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

// import Constants
import getAMTs, { AMTs } from "./getContentAmts";
import {
    filterChallengePosts,
    filterPostsAndEvents,
    sortIds_InsertionSort,
} from "./filterPostsAndEvents";
import { setCachedContentData } from "./contentCacheLoader";

let safedPosts = [];

/**
 * Gets User-Specific Content for Group
 * @param {number[]} cachedData List of Cached Data is Shown
 * @param {number[]} prevContentPosts List of Showing Post Ids
 * @param {boolean} loadNew true if Content Data of Group needs to get fetched new
 * @returns {Object[]} Showing Content of Group
 */
export default async function handleChallengeContent(
    cachedData,
    prevContentPosts,
    loadNew
) {
    console.log("handleChallengeContent", prevContentPosts);

    // Create References
    const db = ref(getDatabase());

    // Load correct Amount of Contents
    await getAMTs();
    // set Amount of Showing Posts per Loading
    const POST_AMT = AMTs[0];

    let postsList = safedPosts;
    if (loadNew) postsList = await getChallengePosts(db);

    // Additional Step: whenever `postsList` is empty, there is no Content to Load => return Empty List
    if (postsList === null || postsList.length === 0) return [];

    filterChallengePosts(postsList, prevContentPosts);

    const usingPosts = getCurrentPosts(postsList, POST_AMT);

    // Update showing Lists
    prevContentPosts.push(...usingPosts);

    return modifyIdsToObject(usingPosts, false);
}

/**
 * Gets User-Specific Content for Group
 * @param {number[]} cachedData List of Cached Data is Shown
 * @param {boolean} loadNew true if Content Data of Group needs to get fetched new
 * @returns {Object[]} Showing Content of Group
 */
export async function handleChallengeContent_Caching(
    cachedData,
    prevContentPosts,
    loadNew
) {
    console.log("handleChallengeContent");

    // Create References
    const db = ref(getDatabase());

    // Load correct Amount of Contents
    await getAMTs();
    // set Amount of Showing Posts per Loading
    const POST_AMT = AMTs[0];

    /*
    There are two cases in loading: 

    Case 1: `cachedData` === null
    We fetch Data in usual Way:
    => get all Posts || use safed Content
    => Filter all shownContent
    => Get Current List
    => return and safe 

    Case 2: `cachedData` !== null
    We just need new Content <=> posts.id > cachedData[0].id:
    => we fetch all Posts
    => Filter all shownContent
    => Get all Posts with id > cachedData[0].id
    => safe and return

    Common steps:
    - fetch all posts when `loadNew` === `true` or use `safedPosts`
    - Filter all shownContent 
    */

    //#region Fetch all posts when `loadNew` === `true` or use `safedPosts`
    let postsList = safedPosts;

    if (loadNew) postsList = await getChallengePosts(db);

    // Additional Step: whenever `postsList` is empty, there is no Content to Load => return Empty List
    if (postsList === null || postsList.length === 0) return [];
    //#endregion

    // Filter all shownContent
    filterChallengePosts(postsList, prevContentPosts);

    if (cachedData === null) getCurrentPosts(postsList, POST_AMT);
    else getNewPosts(postsList, POST_AMT, cachedData[0].id);

    // Update showing List
    prevContentPosts.push(...postsList);

    return modifyIdsToObject(postsList, loadNew);
}

/**
 *
 * @param {String} db Reference to Firebase Database
 * @returns {number[] | null}Posts List
 */
const getChallengePosts = async db =>
    (await get(child(db, `groups/2/posts`))).val();

function getCurrentPosts(postsList, amt) {
    let bound = postsList.length - amt;
    if (bound < 0) bound = 0;

    let output = postsList.splice(
        //   It removes the last amt Elements of the Group Post List,
        bound //  if I need to reuse the last Elements than use Array.slice() instead.
    );
    safedPosts = postsList;
    return output;
}
/**
 * Modifies `postsList` to the most recent posts and sets the other to safedPosts
 * @param {number[]} postsList List of Post Ids
 * @param {number} amt Amount of Posts that should be returned
 */
function getCurrentPosts_Cached(postsList, amt) {
    safedPosts = postsList.reverse().splice(amt).reverse();
    safedPosts.reverse();
}

/**
 * Filters all Elements
 * @param {number[]} postsList List of Post Ids
 * @param {number} amt Amount of Posts that should be returned
 * @param {number} bound Bound Element to filter
 */
function getNewPosts(postsList, amt, bound) {
    let i = 0;

    for (i = 0; i < postsList.length; i++) if (postsList[i] < bound) break;

    if (i > amt) i = amt;

    safedPosts = postsList.reverse().splice(i).reverse();
    safedPosts.reverse();
}

/**
 *
 * @param {number[]} postsList List of Post Ids
 * @returns {Object[]} Output List of Posts
 */
function modifyIdsToObject(postsList, loadNew) {
    let output = [];
    postsList.forEach(id => output.push({ id: id, type: 0 }));

    // Safe new Content in Cache for quick Load
    if (output.length != 0 && loadNew) setCachedContentData(2, output);

    return output;
}
