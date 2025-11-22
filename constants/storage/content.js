import { getData, removeData, storeData } from ".";

/**
 * Stores content data into Cache
 * @param {number} id Id of content
 * @param {Object} data Content data
 * @returns {Promise<boolean>} True if action was successful
 */
export async function storeContent(id, data) {
    const rsp = await storeData(`${id}`, data);

    if (rsp) await storeContentKey(id);

    return rsp;
}

/**
 * Loads content data for given Id
 * @param {number} id Id of content
 * @returns {Promise<Object|null>} Content data
 */
export async function loadContent(id) {
    const data = await getData(`${id}`);
    return data;
}

const CONTENT_KEYS_KEY = "contentKeys";
/**
 * Fetches all stored content data ids
 * @returns {Promise<Array<Strings>>} Array of stringified content ids
 */
async function getContentKeys() {
    const keys = await getData(CONTENT_KEYS_KEY);
    if (!keys) return [];
    return keys;
}
/**
 * Stores all id of stored content datas
 * @param {number} id Id of content
 * @returns {Promise<boolean>} True if action was successful
 */
async function storeContentKey(id) {
    const keys = await getContentKeys();
    keys.push(`${id}`);

    const rsp = await storeData(CONTENT_KEYS_KEY, keys);
    return rsp;
}

/**
 * Removes evers content data stored in cache by stored ids
 * @returns {Promise<boolean>} True if every content data was removed from cache
 */
export async function removeAllContentData() {
    const keys = await getContentKeys();
    let unsucessList = [];

    for (let i = 0; i < keys.length; i++) {
        const rsp = await removeData(keys[i]);
        if (!rsp) unsucessList.push(keys[i]);
    }

    const rsp = await storeData(CONTENT_KEYS_KEY, unsucessList);
    return rsp;
}
