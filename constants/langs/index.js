import hsb from "./hsb.json";
import dsb from "./dsb.json";
import de from "./de.json";

let currentLanguage = -1;

export function getCurrentLanguage() {
    return currentLanguage;
}

export function changeLanguage(language) {
    currentLanguage = language;
}

export function getLangs(key) {
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
            output = "";
            break;
    }

    // if (output.length === 0) output = de.app[key];
    return output;
}

export function getLangsSpecific(key, lang) {
    let output = "";
    switch (lang) {
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
