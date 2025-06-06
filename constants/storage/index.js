import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 *
 * @param {String} key single string
 * @param {*} value
 */
export const storeData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log("error storage/index.js storeData", e);
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
    }
};

/**
 *
 * @param {String} key
 * @returns Object
 */
export const removeData = async key => {
    try {
        const jsonValue = await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log("error storage/index.js removeData", e);
    }
};

const KEYS_LIST = [
    "userIsAdmin",
    "userData",
    "userId",
    "hasUploadForChallenge",
];

export const removeAll = async () => {
    try {
        await AsyncStorage.multiRemove(KEYS_LIST);
    } catch (e) {
        console.log("error storage/index.js removeAll", e);
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
