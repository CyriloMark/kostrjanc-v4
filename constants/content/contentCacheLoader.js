// import Constats
import { getData, storeData, hasData } from "../storage";
import { Group_Placeholder } from "./PlaceholderData";

const SAFE_KEY_FORMAT = "async_{group_id}";

/**
 * Fetches last seen Data in Async Storage for further use
 * @param {Group_Placeholder} group Group to fetch from Async Storage
 */
export async function getCachedGroupContent(group) {
    const key = buildKey(group.id);

    if (!hasData(key)) return null;

    getData(key)
        .then(data => {
            return JSON.parse(data);
        })
        .catch(error =>
            console.log(
                "error in constants/content/contentCacheLoader.js",
                error
            )
        );
}

/**
 * Caches currently fetched Data from Group-Content into Cache
 * @param {Group_Placeholder} group Active Group
 * @param {*} data Data to Store in Cache
 */
export async function setCachedGroupContent(group, data) {
    const key = buildKey(group.id);

    storeData(key, JSON.stringify(data));
}

/**
 * Builds the Key for Stored Data according to SAFE_KEY_FORMAT
 * @param {String} groupId Id of Group
 * @returns
 */
function buildKey(groupId) {
    const groupIdRegex = /{group_id}/g;
    return SAFE_KEY_FORMAT.replace(groupIdRegex, groupId);
}
