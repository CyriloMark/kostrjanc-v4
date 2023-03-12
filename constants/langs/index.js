import hsb from "./hsb.json";
import dsb from "./dsb.json";
import de from "./de.json";

let currentLanguage = -1;

const langs = {
    0: "hsb",
    1: "dsb",
    2: "de",
};

export function getCurrentLanguage() {
    console.log("currentLanguage", currentLanguage);
    return currentLanguage;
}

export function changeLanguage(language) {
    currentLanguage = language;
}

export function get(key) {
    let output = "";
    switch (currentLanguage) {
        case 0:
            output = hsb.app[key];
            break;
        case 1:
            output = dsb.app[key];
            break;
        case 2:
            output = de.app[key];
            break;

        default:
            return false;
    }
    return output;
}

export function getLangSpecific(key, lang) {
    let output = "";
    switch (lang) {
        case 0:
            output = hsb[key];
            break;
        case 1:
            output = dsb[key];
            break;
        case 2:
            output = de[key];
            break;

        default:
            break;
    }
    return output;
}
