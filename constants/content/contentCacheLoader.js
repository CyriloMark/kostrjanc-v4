// import Constats
import { getData, storeData, hasData } from "../storage";

const SAFE_KEY_FORMAT = "cachedContentData_{group_id}";

/**
 *
 * @param {*} groupId Group Id
 */
export default async function fetchCachedContentData(groupId) {
    if (groupId != 2) return null;

    const key = buildKey(groupId);

    if (!(await hasData(key))) return null;

    const data = await getData(key);
    return JSON.parse(data);
}

/**
 * Caches currently fetched Data from Group-Content into Cache
 * @param {*} groupId Active Group
 * @param {*} data Data to Store in Cache
 */
export async function setCachedContentData(groupId, data) {
    const key = buildKey(groupId);

    return await storeData(key, JSON.stringify(data));
}

/**
 * Builds the Key for Stored Data according to SAFE_KEY_FORMAT
 * @param {*} groupId Id of Group
 * @returns
 */
function buildKey(groupId) {
    const groupIdRegex = /{group_id}/g;
    return SAFE_KEY_FORMAT.replace(groupIdRegex, groupId);
}
