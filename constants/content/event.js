import { getDatabase, get, child, ref, set } from "firebase/database";
import { getData, getUID, storeData } from "../storage";

/**
 *
 * @param {number} id Id of Event
 * @param {Array<number>} currentChecks List of checked user Ids
 * @param {Array<Object>} currentChecksDataList Current List of checked user datas
 * @returns {Promise<Array<Object>>} List of
 */
export async function checkEvent(id, currentChecks, currentChecksDataList) {
    try {
        const UID = await getUID();
        let currCh = currentChecks;

        const uncheck = currCh.includes(UID);

        if (uncheck) {
            currCh.splice(currCh.indexOf(UID), 1);
        } else {
            currCh.push(UID);
        }

        // Special case zero
        if (currCh.length === 0) return [];

        let checksDataList = [];
        for (let i = 0; i < currCh.length; i++) {
            const user = (
                await get(child(ref(getDatabase()), `users/${currCh[i]}`))
            ).val();
            if (user.isBanned) continue;

            checksDataList.push({
                id: currCh[i],
                name: user["name"],
                pbUri: user["pbUri"],
            });
        }

        // Write new checks into cache
        await checkIntoLocalStorage(id, uncheck);

        // Fetch updated checks list to Firebase
        await set(ref(getDatabase(), `events/${id}/checks`), currCh);

        return checksDataList;
    } catch (e) {
        console.log("error in checkEvent()");
        return currentChecksDataList;
    }
}

/**
 *
 * @param {number} id Id of event
 * @param {boolean} uncheck True if event was unchecked
 * @returns {Promise<boolean>} True if action was successful
 */
async function checkIntoLocalStorage(id, uncheck) {
    try {
        // Get current checks from cache
        let checks = await getData("checkedEvents");
        if (!checks) checks = [];

        if (uncheck) {
            // Remove id
            const index = checks.indexOf(id);
            if (index !== -1) checks.splice(index, 1);
        } else {
            // Add id
            checks.push(id);
        }

        // Store new list into cache
        const rsp = await storeData("checkedEvents", checks);
        return rsp;
    } catch (e) {
        console.log("error checkIntoLocalStorage(newList)");
        return false;
    }
}
