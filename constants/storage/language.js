import * as SecureStore from "expo-secure-store";
import { changeLanguage } from "../langs";

export async function save(key, value) {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function load(key) {
    let result = await SecureStore.getItemAsync(key);
    return JSON.parse(result);
}

export async function checkIfLangIsSet() {
    const lang = await load("currentLanguage");
    if (lang !== null) {
        changeLanguage(lang);
        save("currentLanguage", lang);
        return true;
    } else return false;
}

export async function remove(key) {
    await SecureStore.deleteItemAsync(key);
}
