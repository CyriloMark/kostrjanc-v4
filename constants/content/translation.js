import { Alert } from "react-native";
import { getLangs } from "../langs";

export const TRANSLATION_SIGN = "∂";

/**
 *
 * @param {String} text Input Text should get checked for Translation Sign at the beginning
 * @return true if the Text was translated
 */
export function checkIsTranslated(text) {
    return text.startsWith(TRANSLATION_SIGN);
}

/**
 *
 * @param {String} text Text that should get checked if it was translated
 * @returns text without Translation Sign
 */
export function getUnsignedTranslationText(text) {
    if (!checkIsTranslated(text)) return text;

    return text.substring(1, text.length);
}

export function alertForTranslation() {
    Alert.alert(
        getLangs("conent_translation_title"),
        getLangs("conent_translation_sub"),
        [
            {
                text: "Ok",
                style: "default",
                isPreferred: true,
            },
        ]
    );
}
