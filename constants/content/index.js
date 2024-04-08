import { getCurrentLanguage } from "../langs";
import { convertTimestampToString } from "../time";

/**
 *
 * @param {String} text
 */
export function checkForUnnecessaryNewLine(text) {
    if (!text.endsWith("\n")) return text;
    return text.substring(0, text.length - 1);
}

/**
 * Creates Text of Time difference between now and time (Variable)
 * @param {number} time Number of Date
 * @returns {string} Text result for time difference depending of language
 */
export function getTimePassed(time) {
    if (time === 0) return;

    let difference = Math.floor((Date.now() - time) / 1000);

    let days = Math.floor(difference / (60 * 60 * 24));
    const hours = Math.floor((difference / (60 * 60)) % 24);
    const mins = Math.floor((difference / 60) % 60);
    const sec = difference % 60;

    let month = Math.floor(days / 31);
    days %= 31;
    const years = Math.floor(month / 12);
    month %= 12;

    let output = "";
    switch (getCurrentLanguage()) {
        // Lang == HSB
        case 0:
            output = handleHSB(years, month, days, hours, mins, sec);
            break;

        // Lang == DE
        case 2:
            output = handleDE(years, month, days, hours, mins, sec);
            break;

        default:
            output = handleHSB(years, month, days, hours, mins, sec);
            break;
    }

    return output;
}

//#region Help Functions for getTimePassed
function getNumber(num) {
    let val = "";
    switch (num) {
        case 3:
            val = "třomi";
            break;
        case 4:
            val = "štyrjomi";
            break;
        case 5:
            val = "pjeć";
            break;
        case 6:
            val = "šěsć";
            break;
        case 7:
            val = "sydom";
            break;
        case 8:
            val = "wosom";
            break;
        case 9:
            val = "dźewjeć";
            break;
        case 10:
            val = "dźesać";
            break;
        case 11:
            val = "jědnaće";
            break;
        case 12:
            val = "dwanaće";
            break;
        default:
            val = num;
            break;
    }
    return val;
}

function getNumberDE(num) {
    let val = "";
    switch (num) {
        case 3:
            val = "drei";
            break;
        case 4:
            val = "vier";
            break;
        case 5:
            val = "fünf";
            break;
        case 6:
            val = "sechs";
            break;
        case 7:
            val = "sieben";
            break;
        case 8:
            val = "acht";
            break;
        case 9:
            val = "neun";
            break;
        case 10:
            val = "zehn";
            break;
        case 11:
            val = "elf";
            break;
        case 12:
            val = "zwölf";
            break;
        default:
            val = num;
            break;
    }
    return val;
}
//#endregion

/**
 *
 * @param {string} text
 * @param {number} selection
 * @param {string} char
 */
export function insertCharacterOnCursor(text, selection, char) {
    let first = text.substring(0, selection);
    let second = text.slice(selection);
    return first + char + second;
}

function handleHSB(years, month, days, hours, mins, sec) {
    let output = "";
    output += "Před ";

    if (years > 0) {
        // Years
        // Years
        switch (years) {
            case 1:
                output += "lětom";
                break;
            case 2:
                output += "lětomaj";
                break;
            default:
                output += `${getNumber(years)} lětami`;
                break;
        }
    } else if (month > 0) {
        // Month (and Days)
        // Month
        switch (month) {
            case 1:
                output += "měsacom";
                break;
            case 2:
                output += "měsacomaj";
                break;
            default:
                output += `${getNumber(month)} měsacami`;
                break;
        }

        if (days > 0) {
            output += " a ";

            switch (days) {
                case 1:
                    output += "dnjom";
                    break;
                case 2:
                    output += "dnjomaj";
                    break;
                default:
                    output += `${getNumber(days)} dnjemi`;
                    break;
            }
        }
    } else if (days > 0) {
        // Days

        switch (days) {
            case 1:
                output += "dnjom";
                break;
            case 2:
                output += "dnjomaj";
                break;
            default:
                output += `${getNumber(days)} dnjemi`;
                break;
        }

        if (hours > 0) {
            output += " a ";

            switch (hours) {
                case 1:
                    output += "hodźinu";
                    break;
                case 2:
                    output += "hodźinomaj";
                    break;
                default:
                    output += `${getNumber(hours)} hodźinami`;
                    break;
            }
        }
    } else if (hours > 0) {
        switch (hours) {
            case 1:
                output += "hodźinu";
                break;
            case 2:
                output += "hodźinomaj";
                break;
            default:
                output += `${getNumber(hours)} hodźinami`;
                break;
        }

        if (mins > 0) {
            output += sec > 0 ? ", " : " a ";

            switch (mins) {
                case 1:
                    output += "mjeńšinu";
                    break;
                case 2:
                    output += "mjeńšinomaj";
                    break;
                default:
                    output += `${getNumber(mins)} mjeńšinami`;
                    break;
            }
        }

        if (sec > 0) {
            output += " a ";

            switch (sec) {
                case 1:
                    output += "sekundu";
                    break;
                case 2:
                    output += "sekundomaj";
                    break;
                default:
                    output += `${getNumber(sec)} sekundami`;
                    break;
            }
        }
    } else if (mins > 0) {
        switch (mins) {
            case 1:
                output += "mjeńšinu";
                break;
            case 2:
                output += "mjeńšinomaj";
                break;
            default:
                output += `${getNumber(mins)} mjeńšinami`;
                break;
        }

        if (sec > 0) {
            output += " a ";

            switch (sec) {
                case 1:
                    output += "sekundu";
                    break;
                case 2:
                    output += "sekundomaj";
                    break;
                default:
                    output += `${getNumber(sec)} sekundami`;
                    break;
            }
        }
    } else if (sec > 0) {
        switch (sec) {
            case 1:
                output += "sekundu";
                break;
            case 2:
                output += "sekundomaj";
                break;
            default:
                output += `${getNumber(sec)} sekundami`;
                break;
        }
    } else output = convertTimestampToString(text);

    output += " wozjewjene.";
    return output;
}
function handleDE() {
    let output = "";
    output += "Vor ";

    if (years > 0) {
        // Years
        switch (years) {
            case 1:
                output += "einem Jahr";
                break;
            default:
                output += `${getNumberDE(years)} Jahren`;
                break;
        }
    } else if (month > 0) {
        // Month (and Days)
        // Month
        switch (month) {
            case 1:
                output += "einem Monat";
                break;
            default:
                output += `${getNumberDE(month)} Monaten`;
                break;
        }

        if (days > 0) {
            output += " und ";

            switch (days) {
                case 1:
                    output += "einem Tag";
                    break;
                default:
                    output += `${getNumberDE(days)} Tagen`;
                    break;
            }
        }
    } else if (days > 0) {
        // Days

        switch (days) {
            case 1:
                output += "einem Tag";
                break;
            default:
                output += `${getNumberDE(days)} Tagen`;
                break;
        }

        if (hours > 0) {
            output += " und ";

            switch (hours) {
                case 1:
                    output += "einer Stunde";
                    break;
                default:
                    output += `${getNumberDE(hours)} Stunden`;
                    break;
            }
        }
    } else if (hours > 0) {
        switch (hours) {
            case 1:
                output += "einer Stunde";
                break;
            default:
                output += `${getNumberDE(hours)} Stunden`;
                break;
        }

        if (mins > 0) {
            output += sec > 0 ? ", " : " und ";

            switch (mins) {
                case 1:
                    output += "einer Minute";
                    break;
                default:
                    output += `${getNumberDE(mins)} Minuten`;
                    break;
            }
        }

        if (sec > 0) {
            output += " und ";

            switch (sec) {
                case 1:
                    output += "einer Sekunde";
                    break;
                default:
                    output += `${getNumberDE(sec)} Sekunden`;
                    break;
            }
        }
    } else if (mins > 0) {
        switch (mins) {
            case 1:
                output += "einer Minute";
                break;
            default:
                output += `${getNumberDE(mins)} Minuten`;
                break;
        }

        if (sec > 0) {
            output += " und ";

            switch (sec) {
                case 1:
                    output += "einer Sekunde";
                    break;
                default:
                    output += `${getNumberDE(sec)} Sekunden`;
                    break;
            }
        }
    } else if (sec > 0) {
        switch (sec) {
            case 1:
                output += "einer Sekunde";
                break;
            default:
                output += `${getNumberDE(sec)} Sekunden`;
                break;
        }
    } else output = convertTimestampToString(text);

    output += " veröffentlicht.";
    return output;
}

export const URL_REGEX =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

/**
 *
 * @param {String} text String to match for URL
 */
export function checkForURLs(text) {
    const urls = text.match(URL_REGEX);

    if (!urls)
        return [
            {
                hasUrl: false,
                text: text,
            },
        ];

    let output = [];

    let startIndex = 0;

    for (let i = 0; i < urls.length; i++) {
        const ind = text.indexOf(urls[i], startIndex);
        output.push(
            {
                hasUrl: false,
                text: text.substring(startIndex, ind),
            },
            {
                hasUrl: true,
                text: urls[i],
            }
        );
        startIndex = ind + urls[i].length;
    }

    if (startIndex != text.length)
        output.push({
            hasUrl: false,
            text: text.substring(startIndex),
        });

    return output;
}

import { createDownloadResumable, documentDirectory } from "expo-file-system";
export async function getImageData(uri, fromEdit, id) {
    if (!fromEdit) return uri;

    const downloadResumable = createDownloadResumable(
        uri,
        documentDirectory + id + ".jpg"
    );

    try {
        const { uri } = await downloadResumable.downloadAsync();
        return uri;
    } catch (e) {
        console.error(e);
    }
}

import { get, ref, child, getDatabase } from "firebase/database";
import { storeData } from "../storage";
/**
 *
 * @param {number[]} postsList List of Post Ids
 */
export async function checkForChallengable(postsList) {
    await get(child(ref(getDatabase()), `groups/2/posts`)).then(
        async challengeSnap => {
            if (!challengeSnap.exists())
                return await storeData("hasUploadForChallenge", false);

            const challengeData = challengeSnap.val();

            let isInList = false;
            challengeData.forEach(el => {
                if (postsList.includes(el)) isInList = true;
            });

            await storeData("hasUploadForChallenge", isInList);
        }
    );
}
