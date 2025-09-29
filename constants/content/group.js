import { child, get, getDatabase, ref } from "firebase/database";
import makeRequest from "../request";
import { getLangs } from "../langs";
import { Alert } from "react-native";

export async function searchUsers(val) {
    try {
        const rsp = await makeRequest("/user/search", {
            query: val,
        });

        let results = [];
        rsp.hits.map(hit =>
            results.push({
                name: hit.primary,
                pbUri: hit.img,
                id: hit.id.substring(2),
            })
        );
        return results;
    } catch (error) {
        console.log(
            "error getMeiliSearch request",
            "InputField pages/create/GroupCreate.jsx",
            error
        );
        return [];
    }
}

/**
 * Checks whether a group name is available in the database.
 *
 * - Returns `true` if the group name is not found.
 * - Returns `false` if the name is already taken or an error occurs.
 * - Shows an alert when the name is taken.
 *
 * @param {string} groupName - The group name to check.
 * @returns {Promise<boolean>} Whether the name is available.
 */
export async function checkIfGroupNameIsAvailable(groupName) {
    const db = getDatabase();
    const groupPath = `groups/${groupName}/name`;

    try {
        const groupSnap = await get(child(ref(db), groupPath));

        if (!groupSnap.exists()) {
            return true; // available
        }

        Alert.alert(
            getLangs("groupcreate_info_name_notavailable_title"),
            getLangs("groupcreate_info_name_notavailable_sub"),
            [{ text: "Ok", isPreferred: true, style: "default" }]
        );

        return false; // taken
    } catch (error) {
        console.error("error checkIfGroupNameIsAvailable failed", {
            groupName,
            error,
        });
        return false; // fail-safe: treat errors as "not available"
    }
}
