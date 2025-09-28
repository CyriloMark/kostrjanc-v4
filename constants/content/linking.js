import { getLangs } from "../langs";
import makeRequest from "../request";

//#region LINK Constants
const LINK_SIGN = "µlink";
const LINK_SPLIT = "µ";

export const LINKING_TYPES = {
    Post: "post",
    Event: "event",
    Comment: "comment",
};

//#region checkLinkedUser
export function checkLinkedUser(input) {
    if (!input.includes(LINK_SIGN))
        return [
            {
                isLinked: false,
                text: input,
            },
        ];

    const split = input.split(LINK_SIGN);
    const output = [];

    let a = 1;

    if (!split[0].includes(LINK_SPLIT))
        output.push({
            isLinked: false,
            text: split[0],
        });
    else a = 0;

    for (let i = a; i < split.length; i++) {
        /*
        0: id,
        1: @content,
        2: rest content
        */
        let splitSection = split[i].split(LINK_SPLIT);
        output.push(
            {
                isLinked: true,
                text: splitSection[1],
                id: splitSection[0],
            },
            {
                isLinked: false,
                text: splitSection[2],
            }
        );
    }

    return output;
}

//#region getClearedLinkedText
export function getClearedLinkedText(input) {
    if (!input.includes(LINK_SIGN)) return input;

    const split = input.split(LINK_SIGN);
    let outputTexts = [];

    let a = 1;
    if (!split[0].includes(LINK_SPLIT)) outputTexts.push(split[0]);
    else a = 0;

    for (let i = a; i < split.length; i++) {
        let splitSection = split[i].split(LINK_SPLIT);
        splitSection.shift();
        outputTexts.push(...splitSection);
    }

    let output = "";
    outputTexts.forEach(el => (output += el));
    return output;
}

//#region getCombinedLinkedText
/**
 *
 * @param {*} text
 * @param {*[]} linkings
 */
export function getCombinedLinkedText(text, linkings) {
    if (linkings.length === 0) return text;

    const sortedLinkings = linkings.sort((a, b) => a[start] - b[start]);

    console.log(sortedLinkings);

    return text;

    let outputTexts = [];
    for (let i = 0; i < linkings.length; i++) {}
}

//#region checkForLinkings
/**
 * @returns {bool} Returns true if text contains one or more @ signs
 * @param {*} text Input for checking
 */
export function checkForLinkings(text) {
    const split = text.split(" ");
    for (let i = 0; i < split.length; i++)
        if (split[i].startsWith("@") && split[i].length !== 1) return true;
    return false;
}

//#region getLinkingsFromPlainText
/**
 *
 * @param {String} text
 */
export function getLinkingsFromPlainText(text, start) {
    if (!text.includes("@")) return [];

    const split = text.split("@");
    const output = [start];
    let a = 1;

    if (split.length === 1) a = 0;

    for (let i = a; i < split.length; i++) {
        const link = split[i].split(" ");

        let start = 0;
        for (let j = 0; j < i; j++) start += split[j].length;

        output.push({
            user: null,
            text: `@${link[0]}`,
            start: start,
        });
    }
    return output;
}

//#region readLinkings
/**
 * Extracts "linkings" (special references, tags, or links) from a given content object
 * depending on its type (Post, Event, or Comment).
 *
 * Behavior:
 * - For Posts and Events:
 *   - Checks the `title` and `description` fields for linkings.
 *   - If linkings exist, they are extracted with context-specific section labels.
 *   - If no linkings are found, an empty array is pushed for consistency.
 * - For Comments:
 *   - Extracts linkings directly from the comment text.
 *
 * Example:
 *   Input:  { type: LINKING_TYPES.Post, content: { title: "Hello @user", description: "Check #topic" } }
 *   Output: [
 *     [ /* linkings from title *\/ ],
 *     [ /* linkings from description *\/ ]
 *   ]
 *
 * @param {string} type - The type of content (Post, Event, or Comment).
 * @param {object|string} content - The content to analyze:
 *   - For Post/Event → object with `title` and `description`.
 *   - For Comment   → string representing the comment text.
 * @returns {Array} - An array of extracted linkings. Each entry is either a list of linkings or an empty array.
 */
export function readLinkings(type, content) {
    let output = [];

    // Helper for handling Post/Event (avoids duplication)
    function handleWithFields(titleKey, descKey) {
        if (checkForLinkings(content.title))
            output.push(
                getLinkingsFromPlainText(content.title, {
                    section: getLangs(titleKey),
                })
            );
        else output.push([]);

        if (checkForLinkings(content.description))
            output.push(
                getLinkingsFromPlainText(content.description, {
                    section: getLangs(descKey),
                })
            );
        else output.push([]);
    }

    switch (type) {
        case LINKING_TYPES.Post:
            handleWithFields(
                "postcreate_info_title",
                "postcreate_info_description"
            );
            break;
        case LINKING_TYPES.Event:
            handleWithFields(
                "eventcreate_info_title",
                "eventcreate_info_description"
            );
            break;
        case LINKING_TYPES.Comment:
            output.push(
                getLinkingsFromPlainText(content, {
                    section: getLangs("content_comments_title"),
                })
            );
            break;
        default:
            break;
    }

    return output;
}

//#region removeUnnecessaryEmpties
/**
 * Removes unnecessary spaces from a string.
 *
 * This function takes an input string, splits it by spaces,
 * removes any empty entries (caused by multiple spaces),
 * and rejoins the parts into a single string with only one space between words.
 *
 * Example:
 *   Input:  "Hello    world   !"
 *   Output: "Hello world !"
 *
 * @param {string} input - The string to clean up.
 * @returns {string} - The cleaned string with normalized spaces.
 */
function removeUnnecessaryEmpties(input) {
    // Split the input string into an array using space (" ") as the separator
    // Example: "hello   world" → ["hello", "", "", "world"]
    let output = input
        .split(" ")
        // Filter out empty strings from the array (caused by consecutive spaces)
        // Example: ["hello", "", "", "world"] → ["hello", "world"]
        .filter(el => el.length !== 0)
        // Join the filtered array back into a single string with single spaces
        // Example: ["hello", "world"] → "hello world"
        .join(" ");

    // Return the cleaned-up string
    return output;
}

//#region fetchUsers
/**
 * Fetches users from the server based on a search text.
 *
 * Behavior:
 * - If the input `text` is empty or longer than 64 characters,
 *   the current user result state is cleared and the function returns early.
 * - Otherwise, it sends a request to `/user/search` with the query string.
 * - On success, it transforms the response hits into a list of user objects
 *   with `name`, `pbUri` (profile picture URI), and `id`.
 * - On failure, it logs the error but does not throw.
 *
 * Example:
 *   Input:  "alice"
 *   Output: [
 *     { name: "Alice", pbUri: "https://...", id: "123" },
 *     { name: "Alicia", pbUri: "https://...", id: "456" }
 *   ]
 *
 * @param {string} text - The search string for querying users.
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
 */
export async function fetchUsers(text) {
    if (text.length <= 0 || text.length > 64) {
        setCurrentUserResult([]);
        return [];
    }

    try {
        const rsp = await makeRequest("/user/search", { query: text });

        // Map response hits into clean user objects
        const results = rsp.hits.map(hit => ({
            name: hit.primary,
            pbUri: hit.img,
            id: hit.id.substring(2), // remove first two chars
        }));

        return results;
    } catch (error) {
        console.log(
            "error getMeiliSearch request",
            "fetchUsers constants/content/linking.js",
            error
        );
        return [];
    }
}

//#region checkLinkingSubmitButton
/**
 * Checks whether the "submit" button for linkings should be enabled.
 *
 * Behavior:
 * - Returns `false` if the users list is `null`.
 * - Iterates through a nested list of users:
 *   - For each sub-list (usersList[i]), it checks all elements starting from index 1
 *     (skipping index 0, which may represent the original content or metadata).
 *   - If any user object has `user === null`, the check fails and returns `false`.
 * - If no invalid entries are found, returns `true`.
 *
 * Example:
 *   Input: [
 *     [{ section: "abc" }, { user: Obj, start: XX, text: "abc" }],
 *     [{ section: "xyz" }, { user: Obj, start: XY, text: "abc" }]
 *   ]
 *   Output: false
 *
 * @param {Array|null} usersList - Nested array of user objects or null.
 * @returns {boolean} - Whether the submit button should be enabled.
 */
export function checkLinkingSubmitButton(usersList) {
    if (usersList === null) return false;

    for (let i = 0; i < usersList.length; i++) {
        for (let j = 1; j < usersList[i].length; j++) {
            if (usersList[i][j].user === null) {
                return false;
            }
        }
    }

    return true;
}

//#region Fkt: confirmLinkings & processTextWithLinkings
/**
 * Processes a text field by replacing @mentions with linking markup.
 *
 * @param {string} text - The original text (title, description, or comment).
 * @param {Array} userLinks - The array of user link objects for this text.
 * @returns {string} - The transformed text with linkings applied.
 */
function processTextWithLinkings(text, userLinks) {
    if (!userLinks || userLinks.length === 0) return text;

    // Build segments based on linking positions
    let outputElements = [];
    for (let i = 0; i < userLinks.length; i++) {
        let start = i === 0 ? 0 : userLinks[i].start;
        let end =
            i !== userLinks.length - 1 ? userLinks[i + 1].start : text.length;
        outputElements.push(text.substring(start, end));
    }

    let finalTextParts = [];
    let sortedLinkings = 0;

    for (let segment of outputElements) {
        if (segment.includes("@")) {
            let words = segment.split(" ");
            for (let word of words) {
                if (word.includes("@")) {
                    const currentLink = userLinks[sortedLinkings + 1];
                    sortedLinkings++;
                    const replacingElement = `${LINK_SIGN}${currentLink.user.id}${LINK_SPLIT}${currentLink.text}${LINK_SPLIT}`;
                    finalTextParts.push(replacingElement);
                } else {
                    finalTextParts.push(removeUnnecessaryEmpties(word));
                }
            }
        } else {
            finalTextParts.push(removeUnnecessaryEmpties(segment));
        }
    }

    // Filter out empty strings and join
    return finalTextParts.filter(el => el.length > 0).join(" ");
}

/**
 * Confirms linkings by transforming the content fields (Post, Event, Comment)
 * based on detected user mentions.
 */
export function confirmLinkings(type, usersList, content) {
    let updatedContent = content;

    switch (type) {
        case LINKING_TYPES.Post:
            if (usersList[0].length !== 0) {
                updatedContent.title = processTextWithLinkings(
                    content.title,
                    usersList[0]
                );
            }
            if (usersList[1].length !== 0) {
                updatedContent.description = processTextWithLinkings(
                    content.description,
                    usersList[1]
                );
            }
            break;

        case LINKING_TYPES.Event:
            if (usersList[0].length !== 0) {
                updatedContent.title = processTextWithLinkings(
                    content.title,
                    usersList[0]
                );
            }
            if (usersList[1].length !== 0) {
                updatedContent.description = processTextWithLinkings(
                    content.description,
                    usersList[1]
                );
            }
            break;

        case LINKING_TYPES.Comment:
            if (usersList[0].length !== 0) {
                updatedContent = processTextWithLinkings(content, usersList[0]);
            }
            break;

        default:
            break;
    }

    return updatedContent;
}
