import makeRequest from "../request";

/**
 *
 * @param {String} text
 * @returns {Object}
 */
export default async function generateSotra(text) {
    const rsp = await makeRequest("/post_event/translate", {
        text: text,
    });
    return rsp;
}
