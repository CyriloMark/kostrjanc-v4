import { getDatabase, get, ref, child } from "firebase/database";

export let AMTs = [0, 0, 0, 0, false];

/**
 * Get Amounts of Content:
 *
 *  0: Posts [All];
 *
 *  1: Posts [Random];
 *
 *  2: Events [All];
 *
 *  3: Events [Random];
 *
 *  4: loaded
 * @returns Amount of Contents
 */
export default async function getAMTs() {
    if (!AMTs[4]) await getContentAmts();
    return AMTs;
}

async function getContentAmts() {
    await get(child(ref(getDatabase()), `AMT_post-event-ad`))
        .then(amtsSnap => {
            if (amtsSnap.exists()) AMTs = [...amtsSnap.val(), true];
        })
        .catch(error =>
            console.log(
                "error constants/content/getContentAmts.js",
                "getContentAmts get amts",
                error.code
            )
        );
}
