import makeRequest from "../request";

/**
 *
 * @param {string} input Current Input to extract last word
 */
function getCurrentWord(input) {
    const split = input.split(" ");
    return split[split.length - 1];
}

/**
 *
 * @param {string} word1 First Word to check; the older version
 * @param {string} word2 Second Word to check; the newer one.
 * @returns {number}
 */
export function getCursorPosition(word1, word2) {
    if (word1 == word2) return word1.length;

    if (word2 > word1) {
        let i = 0;
        while (i < word2.length) {
            /*console.log("w1:", word1[i], "w2:", word2[i]);
            if (word1[i] === undefined) i++;
            else*/ if (word1[i] != word2[i]) break;
            else i++;
        }
        return i + 1;
    } else {
        let i = 0;
        while (i < word1.length) {
            if (word1[i] != word2[i]) break;
            else i++;
        }
        return i;
    }

    //  Hallo i bin der Tom        Hallo ic bin der Tom

    // Hallo i| bin der Tom     7
    // Hallo ic| bin der Tom    8
}

/**
 *
 * @param {string} input Current Input to find correct Alternatives
 * @returns {object} Object with Status Code and String Array of correct Alternatives
 */
export async function checkForAutoCorrect(input) {
    let output = {
        status: 0,
        content: [],
    };

    const word = getCurrentWord(input);
    if (word.length < 2) {
        output.status = 200;
        return output;
    } else {
        await makeRequest("/post_event/check_words", { word: word })
            .then(words => {
                if (words.length === 0) output.status = 200;
                else
                    output = {
                        status: 300,
                        content: words,
                    };
            })
            .catch(error => {
                console.log(
                    "error constants/content/autoCorrect.js",
                    "error requestWords fetch",
                    error
                );
            });
        return output;
    }
}

/**
 * Different to function above: Difference whether cursor is in middle of input
 * @param {string} input Current Input to find correct Alternatives
 * @param {number} selection
 * @returns {object} Object with Status Code and String Array of correct Alternatives
 */
export default async function checkForAutoCorrectInside(input, selection) {
    const subFromStart = input.substring(0, selection);
    return checkForAutoCorrect(subFromStart);
}
