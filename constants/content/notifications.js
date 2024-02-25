import { getLangs } from "../langs";
import { getData, hasData, storeData } from "../storage";

/**
 * Checks if User was added to a new Group
 * @param {Object[]} groupList Array of current User Groups
 * @returns {Object[]} true if User was added to a new Group
 */
export async function checkForGroupNotifications(groupList) {
    const shownNotificationList = [];

    if (await hasData("groupNotifications"))
        shownNotificationList = JSON.parse(await getData("groupNotifications"));

    let outputList = [];
    for (let i = 0; i < groupList.length; i++)
        if (!shownNotificationList.includes(groupList[i]))
            outputList.push(groupList[i]);

    return outputList;
}

export default Notification_Types = {
    Group: {
        id: 0,
        title: `${getLangs("yes")}$name${getLangs("yes")}`,
        description: getLangs("yes"),
    },
};
