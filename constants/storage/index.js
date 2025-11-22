import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @param {String} key single string
 * @param {*} value
 * @returns {Promise<boolean>} True if action was successful
 */
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (e) {
        console.log("error storage/index.js storeData", e);
        return false;
    }
};

/**
 *
 * @param {String} key
 * @returns Object
 */
export const getData = async key => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("error storage/index.js getData", e);
        return null;
    }
};

/**
 * Removes key data from cache
 * @param {String} key Key
 * @returns {Promise<boolean>} True if action was successful
 */
export const removeData = async key => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.log("error storage/index.js removeData", e);
        return false;
    }
};

const KEYS_LIST = [
    "userIsAdmin",
    "userData",
    "userId",
    "hasUploadForChallenge",
];

/**
 * Removes each key data from KEYS_LIST
 * @returns {Promise<boolean>} True if action was successful
 */
export const removeAll = async () => {
    try {
        await AsyncStorage.multiRemove(KEYS_LIST);
        return true;
    } catch (e) {
        console.log("error storage/index.js removeAll", e);
        return false;
    }
};

export const hasData = async key => {
    try {
        const hasKey = (await AsyncStorage.getAllKeys()).includes(key);
        return hasKey;
    } catch (e) {
        console.log("error in hasData");
        return false;
    }
};

/**
 * Fetches Client user ID from Storage
 * @returns {Promise<String>} User Id
 */
export async function getUID() {
    let uid = await getData("userId");
    if (!uid) {
        uid = require("firebase/auth").getAuth().currentUser.uid;
        await storeData("userId", uid);
    }
    return uid;
}
