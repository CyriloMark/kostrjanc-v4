import makeRequest from "../request";

/**
 * Fetches a User-Related Array of User Ids not used before
 * @param {String[]} usedUsers Array of already used User Ids
 * @param {number} maxAmt Amount of maximal Followers
 * @param {number} maxOut Amount of maximal User Ids out
 * @returns {String[]} Array of User Ids
 */
export default async function fetchRandomUsers(usedUsers, maxAmt, maxOut) {
    return await makeRequest("/algo/follower", {
        max_followers: maxAmt,
        max_out: maxOut,
        previous_followers: usedUsers,
    });
}
