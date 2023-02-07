import hsb from "./hsb.json";
import dsb from "./dsb.json";
import de from "./de.json";

let currentLanguage = 0;

const langs = {
    0: "hsb",
    1: "dsb",
    2: "de",
};

export function getCurrentLanguage() {
    return langs[currentLanguage];
}

export function get(id) {
    let output = "";
    switch (currentLanguage) {
        case 0:
            output = hsb[id];
            break;
        case 1:
            output = dsb[id];
            break;
        case 2:
            output = de[id];
            break;

        default:
            break;
    }
    return output;
}
