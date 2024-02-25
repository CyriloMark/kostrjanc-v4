export const LINK_SIGN = "µlink";
export const LINK_SPLIT = "µ";

export const LINKING_TYPES = {
    Post: "post",
    Event: "event",
    Comment: "comment",
};

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

export function getClearedLinkedText(input) {
    if (!input.includes(LINK_SIGN)) return input;

    const split = input.split(LINK_SIGN);
    console.log(split);
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
