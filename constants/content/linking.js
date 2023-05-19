export const LINK_SIGN = "µlink";
export const LINK_SPLIT = "µ";

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
    let outputTexts = [];
    let a = 1;

    if (!split[0].includes(LINK_SPLIT)) outputTexts.push(split[0]);
    else a = 0;

    for (let i = a; i < split.length; i++) {
        let splitSection = split[i].split(LINK_SPLIT);
        outputTexts.push(splitSection[1]);
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
