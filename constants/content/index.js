/**
 *
 * @param {String} text
 */
export function checkForUnnecessaryNewLine(text) {
    if (!text.endsWith("\n")) return text;
    return text.substring(0, text.length - 1);
}
