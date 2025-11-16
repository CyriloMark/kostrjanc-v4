import { getDatabase, get, child, ref, set } from "firebase/database";
import { getUID } from "../storage";

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

        if (currCh.includes(UID)) {
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

        // Fetch updated checks list to Firebase
        set(ref(getDatabase(), `events/${id}/checks`), currCh);

        return checksDataList;
    } catch (e) {
        console.log("error in checkEvent()");
        return currentChecksDataList;
    }
}
