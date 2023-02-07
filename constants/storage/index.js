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
