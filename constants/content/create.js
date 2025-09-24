import { child, get, getDatabase, ref } from "firebase/database";

import { getData, storeData } from "../storage";
import { getAuth } from "firebase/auth";

/**
 * Fetches all group data for every given group name
 * @param {String[]} g Array of group names
 * @returns {Object[]} Array of all group data for given group names
 */
async function getGroupsData(g) {
    if (!Array.isArray(g)) return [];

    const db = ref(getDatabase());
    let output = [];

    for (let i = 0; i < g.length; i++) {
        await get(child(db, `groups/${g[i]}`)).then(gSnap => {
            if (gSnap.exists()) {
                const gData = gSnap.val();
                output.push({
                    name: gData.name,
                    imgUri: gData.imgUri,
                    id: g[i],
                });
            }
        });
    }

    return output;
}

/**
 * Fetches all participating groups of client and returnes as array
 * @returns {String[]} Array of Group Names
 */
async function getGroups() {
    let groups = [];
    const userData = await getData("userData");

    if (!userData) {
        const db = ref(getDatabase());
        await get(child(db, `users/${getAuth().currentUser.uid}/groups`)).then(
            groupsSnap => {
                if (groupsSnap.exists()) groups = groupsSnap.val();
            }
        );
    } else if (userData.groups) groups = userData.groups;

    return groups;
}

async function checkForChallenge() {
    const hasUploadForChallenge = await getData("hasUploadForChallenge");
    if (hasUploadForChallenge != null) return !hasUploadForChallenge;

    const data = await getData("userData");
    if (!data.posts) return true;

    let postsList = data.posts;

    let hasChallengePost = false;
    await get(child(ref(getDatabase()), "groups/2/posts"))
        .then(challengePosts => {
            if (challengePosts.exists()) {
                let posts = challengePosts.val();
                posts.map(p => (hasChallengePost = postsList.includes(p)));
            }
        })
        .catch(error => console.log("error", "create.js", error.code));

    storeData("hasUploadForChallenge", !hasChallengePost);
    return !hasChallengePost;
}

/**
 *
 * @returns {Object[]} Array of top events including id, score, creator
 */
async function getTopEvents() {
    let events = (
        await get(child(ref(getDatabase()), "top_events/events"))
    ).val();

    if (!events) return [];

    let out = [];
    events.map(e => out.push(e.id));
    return out;
}

async function getEventsData(e) {
    if (!Array.isArray(e)) return [];

    const db = ref(getDatabase());
    let output = [];

    for (let i = 0; i < e.length; i++) {
        await get(child(db, `events/${e[i]}`)).then(eSnap => {
            if (eSnap.exists()) {
                const eData = eSnap.val();
                output.push(eData);
            }
        });
    }

    return output;
}

/**
 * Fetches the Username of any user by id
 * @param {number} id Id of an User
 * @returns {String} Username
 */
async function getCreatorName(id) {
    const username = (
        await get(child(ref(getDatabase()), `users/${id}/name`))
    ).val();
    return username ? username : "";
}

export const create = {
    getGroups,
    getGroupsData,
    checkForChallenge,
    getTopEvents,
    getEventsData,
    getCreatorName,
};
