import { Alert } from "react-native";
import { openURL } from "expo-linking";
import { getLangs } from "./langs";

export function openLink(link) {
    Alert.alert(getLangs("link_title"), getLangs("link_sec"), [
        {
            text: getLangs("no"),
            style: "destructive",
        },
        {
            text: getLangs("yes"),
            style: "default",
            onPress: () => {
                if (link.includes("https://")) openURL(link);
                else openURL(`https://${link}`);
            },
        },
    ]);
}

/**
 * This function splits an Array into an Array of Array: Each inner Array has max length of coloums
 * @param {*[]} data the Array getting split
 * @param {number} coloums an Integer number of coloums the Array should be split
 * @returns
 */
export function arraySplitter(data, coloums) {
    let splitter =
        Math.floor(data.length / coloums) +
        (data.length % coloums === 0 ? 0 : 1);
    let newData = [];

    for (let i = 0; i < splitter; i++) {
        let currentObject = [];
        for (let j = i * coloums; j < coloums + i * coloums; j++) {
            if (j < data.length) currentObject.push(data[j]);
            else currentObject.push(null);
        }
        newData.push(currentObject);
    }
    return newData;
}

/**
 *
 * @param {*[]} data array to sort by date
 * @returns
 */
export function sortArrayByDate(data) {
    let dates = data;
    for (let i = data.length - 1; i >= 0; i--) {
        for (let j = 1; j <= i; j++) {
            if (dates[j - 1].created > dates[j].created) {
                let temp = dates[j - 1];
                dates[j - 1] = dates[j];
                dates[j] = temp;
            }
        }
    }
    return dates;
}

/**
 *
 * @param {number} min Minimal number
 * @param {number} max Maximal number
 * @param {number} ratio Interolation variable [0-1]
 * @returns
 */
export function lerp(min, max, ratio) {
    return min * (1 - ratio) + max * ratio;
}

/**
 *
 * @param {*[]} data Data Array to split
 * @param {number} coloums Maximal Amount of Coloums the output must be split in
 */
export function splitterForContent(data, columns) {
    let outputRanges = [];
    let itemsLeft = data.length;
    while (itemsLeft > 0) {
        const randomAmtPerLine = Math.round(lerp(1, columns, Math.random()));
        if (itemsLeft >= randomAmtPerLine) {
            outputRanges.push(randomAmtPerLine);
            itemsLeft -= randomAmtPerLine;
        } else {
            outputRanges.push(itemsLeft);
            itemsLeft = 0;
        }
    }

    let newData = [];
    let usedAmt = 0;
    for (let i = 0; i < outputRanges.length; i++) {
        let currentObject = [];
        for (let j = usedAmt; j < usedAmt + outputRanges[i]; j++) {
            if (j < data.length) {
                currentObject.push(data[j]);
            }
        }
        usedAmt += outputRanges[i];
        newData.push(currentObject);
    }
    return newData;
}

export const splitArrayIntoNEqualy = (array, amt) => {
    let output = [];
    let amtPerLine = Math.floor(array.length / amt);
    for (let i = 0; i < amt; i++) {
        let a = [];
        for (let j = 0; j < amtPerLine; j++) a.push(array[j + amtPerLine * i]);
        output.push(a);
    }
    if (array.length % amt !== 0)
        for (let i = 0; i < array.length % amt; i++)
            output[amt - 1].push(array[array.length - 1 - i]);
    return output;
};

/**
 *
 * @param {*[]} data Array to sort by Date
 * @param {number|text} sortingKey Key to sort
 */
export function sortArrayByDateFromUnderorderedKey(data, sortingKey) {
    let dates = data;
    for (let i = data.length - 1; i >= 0; i--) {
        for (let j = 1; j <= i; j++) {
            if (dates[j - 1][sortingKey] > dates[j][sortingKey]) {
                let temp = dates[j - 1];
                dates[j - 1] = dates[j];
                dates[j] = temp;
            }
        }
    }
    return dates.reverse();
}

/**
 *
 * @param {*} number An integer
 * @param {*[]} array Array in form: [{start: x, end: y}, {start: x, end: y}, ...]
 * @returns bool, true if number is between 2 and 3; 4 and 5; ...
 */
export function checkNumberInRanges(number, array) {
    if (array.length === 0) return true;
    console.log("a", number, array);
    // Flatten the array into a single array of all numbers
    const flattenedArray = array.flatMap(obj => [obj.start, obj.end]);
    // Sort the flattened array by number
    flattenedArray.sort((a, b) => a - b);

    // Start by assuming the number is not in any of the ranges
    let isInRange = false;

    // Iterate over the sorted array, skipping the first element
    for (let i = 1; i < flattenedArray.length; i += 2) {
        // Check if the number is between the current range
        if (number > flattenedArray[i - 1] && number < flattenedArray[i]) {
            isInRange = true;
            break;
        }
    }

    return isInRange;
}

/**
 * Function that sorts an Object Array by a Paramter
 * @param {object[]} array Array to Sort by Parameter
 * @param {string} parameter as a String of the Object
 */
export function sortByParameter(array, parameter) {
    array.sort((a, b) => b[parameter] - a[parameter]);
}

/**
 * Generates a UID
 * @param {number} length Length of UID generating | default = 10
 * @returns UID
 */
export function makeId(length) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
    }
    return result;
}
