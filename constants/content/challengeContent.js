// import Firebase Library
import { getDatabase, get, ref, child } from "firebase/database";

// import Constants
import getAMTs, { AMTs } from "./getContentAmts";
import {
    filterPostsAndEvents,
    sortIds_InsertionSort,
} from "./filterPostsAndEvents";

const FETCHED_NEW_CONTENT = null;

/**
 * Gets User-Specific Content for Group
 * @param {Object[]} prevContentPosts Previous showing Posts
 * @param {Object[]} prevContentEvents Previous showing Events
 * @param {boolean} loadNew true if Content Data of Group needs to get fetched new
 * @returns {Object[]} Showing Content of Group
 */
export default async function handleChallengeContent(
    prevContentPosts,
    prevContentEvents,
    loadNew
) {}

export const getFetchedNewContent = () => FETCHED_NEW_CONTENT;
