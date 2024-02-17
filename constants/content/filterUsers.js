/**
 * Filters all Elements from filterList in userList
 * @param {String[]} userList List of User Ids
 * @param {String[]} filterList List of User Ids to filter
 * @returns {String[]} Returns a new Array
 */
export function filterUsers(userList, filterList) {
    let output = [];
    for (let i in userList)
        if (!filterList.includes(userList[i])) output.push(userList[i]);
    return output;
}

/**
 * Filter all Duplicates of User Ids
 * @param {String[]} userList Array of User Ids
 * @returns {String[]}
 */
export function filterDuplicateUsers(userList) {
    let seen = {};
    let result = [];

    for (let i = 0; i < userList.length; i++)
        if (!seen[userList[i]]) {
            seen[userList[i]] = true;
            result.push(userList[i]);
        }

    userList = result;
    return result;
}
