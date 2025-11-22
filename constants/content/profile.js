import { Alert } from "react-native";

import { getDatabase, get, ref, child, set } from "firebase/database";

//#region import Constants
import makeRequest from "../request";
import { getLangs } from "../langs";
import { getData, storeData } from "../storage";
import { sendFollowerPushNotification } from "../notifications/follower";
import { Post_Placeholder, User_Placeholder } from "./PlaceholderData";
import { sortArrayByDate } from "..";

/**
 *
 * @param {Object} user User object
 * @param {String} user.name Profile name of user
 * @param {boolean} user.isAdmin Whether user is admin
 * @param {boolean} user.isMod Whether user is Moderator
 * @param {boolean} user.isMK Whether user is an official Młodźinski club Account
 */
export function alertForRoles(user) {
    Alert.alert(
        user.name,
        `${user.name} ${getLangs("profile_role_sub_0")} ${
            user.isAdmin
                ? getLangs("profile_role_admin")
                : user.isMod
                ? getLangs("profile_role_mod")
                : user.isMK
                ? getLangs("profile_role_mk")
                : ""
        } ${getLangs("profile_role_sub_1")}`
    );
}

export async function getIfClientIsAdmin() {
    try {
        const adm = await getData("userIsAdmin");
        return adm !== null ? adm : false;
    } catch (e) {
        return false;
    }
}

let LAST_FOLLOWED_UID = null;
/**
 *
 * @param {String} id User Id of User to follow
 * @param {boolean} unfollow Default `false`
 * @param {String} UID User Id of Client
 */
export async function followUser(id, unfollow, UID) {
    function handleFollowError(rsp) {
        Alert.alert(
            getLangs("profile_onfollow_error_title"),
            getLangs("profile_onfollow_error_sub") + rsp,
            [
                {
                    isPreferred: true,
                    text: "Ok",
                    style: "default",
                },
            ]
        );
    }

    try {
        const body = {
            user: id,
            follow: !unfollow,
            unfollow: unfollow,
        };

        const rsp = await makeRequest("/user/follow", body);

        // Follow Error
        if (rsp.code !== 202) {
            handleFollowError(rsp);
            return false;
        }

        // Follow Notification
        if (LAST_FOLLOWED_UID !== id) {
            LAST_FOLLOWED_UID = id;
            sendFollowerPushNotification(id, UID);
        }

        return true;
    } catch (e) {
        handleFollowError(e);
        return false;
    }
}

/**
 * Fetches user data from Firebase
 * @param {String} id Id of user to load
 * @param {boolean} isClient Whether the user to fetch is client
 * @param {boolean} forceFetch Whether the user data need to be fetched new
 * @returns {Promise<Object>} User Data
 */
export async function loadUser(id, isClient, forceFetch) {
    if (isClient && !forceFetch) {
        let cachedUserData = await getData("userData");
        if (cachedUserData) return cachedUserData;

        // Case of null-Object
        const user = await getUserData(id);
        await storeData("userData", user);
        return user;
    } else {
        const user = await getUserData(id);
        return user;
    }
}

async function getUserData(id) {
    try {
        const userData = (
            await get(child(ref(getDatabase()), `users/${id}`))
        ).val();
        if (userData["isBanned"])
            return {
                ...User_Placeholder,
                isBanned: true,
            };
        return userData;
    } catch (e) {
        console.log("error in getUserData(id)");
        return User_Placeholder;
    }
}

/**
 *
 * @param {Object} userData User data
 * @param {boolean} userData.isBanned True, if user is banned
 * @returns {Object} User data
 */
export function generateProfile(userData) {
    if (userData.isBanned) return userData;

    return {
        ...userData,
        follower: userData["follower"] ? userData.follower : [],
        following: userData["following"] ? userData.following : [],
    };
}

/**
 *
 * @param {Object} userData User data
 * @param {Array<number>} userData.posts List of user posts
 * @param {Array<number>} userData.events List of user events
 * @param {boolean} hideGroupContent True if group content should be hidden
 * @returns {Promise<Array<Object>>} Sortet list of post and event datas for profile
 */
export async function buildProfileContent(userData, hideGroupContent) {
    const hasPosts = !!userData.posts;
    const hasEvents = !!userData.events;

    // Reference to Firebase Database
    const db = ref(getDatabase());

    let postEventDatas = [];
    if (hasPosts) {
        const postDatas = await handleFetchContent(
            db,
            userData.posts,
            0,
            hideGroupContent
        );
        postEventDatas.push(...postDatas);
    }
    if (hasEvents) {
        const eventDatas = await handleFetchContent(
            db,
            userData.events,
            1,
            hideGroupContent
        );
        postEventDatas.push(...eventDatas);
    }

    return sortArrayByDate(postEventDatas).reverse();
}

/**
 *
 * @param {*} db Reference to Firebase Database
 * @param {Array<number>} contentList List of Ids of user contents
 * @param {number} type `0 - Posts | 1 - Events`
 */
async function handleFetchContent(db, contentList, type, hideGroupContent) {
    let outputList = [];

    for (let i = 0; i < contentList.length; i++) {
        try {
            // Get Content data from Firebase
            const curr = (
                await get(
                    child(
                        db,
                        `${type === 0 ? "posts" : "events"}/${contentList[i]}`
                    )
                )
            ).val();
            if (!curr) continue;

            // Check if event is expired
            if (type === 1) {
                await deleteExpiredEvent(curr.id, curr.ending);
            }

            // Check if content is banned
            if (curr.isBanned) continue;
            // Check if content is from a group
            if (curr.group && curr.group !== 2 && hideGroupContent) continue;

            outputList.push(curr);
        } catch (e) {
            console.log("error in handleFetchContent(db, contentList, type)");
        }
    }

    return outputList;
}

/**
 * Generates a list of |posts|+|events|-Placeholders for posts
 * @param {Array<number>} posts List of post ids
 * @param {Array<number>} events List of event ids
 * @returns {Array<Object>} List of Post_Placeholders
 */
export function generatePlaceholderContent(posts, events) {
    let amt = 0;
    if (posts) amt += posts.length;
    if (events) amt += events.length;

    return Array(amt).fill(Post_Placeholder);
}

const DAYS_TO_DELETE_EVENTS = 31;
/**
 *
 * @param {number} id Id of event
 * @param {number} ending Ending date of event
 * @returns {Promise<boolean>} True if operation was successful
 */
async function deleteExpiredEvent(id, ending) {
    try {
        const xDays = 24 * 1000 * 60 * 60 * DAYS_TO_DELETE_EVENTS;
        if (Date.now() - ending < xDays) return true;

        await set(ref(getDatabase(), `events/${id}/isBanned`), true);
        return true;
    } catch (e) {
        console.log("error deleteExpiredEvents(id, ending)");
        return false;
    }
}
