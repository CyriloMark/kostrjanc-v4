import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";

/**
 * Loads the four notifiation settings user has set
 * @param {string} uid User Id
 * @returns {{lang: number, follower: boolean, contents: boolean, comments: boolean, eventStart: boolean}}
 */
export async function getNotificationSettings(uid) {
    let data = {
        lang: 0,
        follower: true,
        contents: true,
        comments: true,
        eventStart: true,
    };

    const snap = await get(
        child(ref(getDatabase()), `users/${uid}/notificationSettings`)
    ).catch(error =>
        console.log(
            "error",
            "constants/settings/nofitications.js getNotificationSettings",
            error.code
        )
    );

    if (snap.exists()) data = snap.val();
    return data;
}

/**
 * Format:
 *  Exp.: {
 *      lang: 0: hsb | 1: dsb | 2: de
 *      follower: true,
        contents: false,
        comments: false,
        eventStart: true,
 * }
 * @param {*} settings
 * @returns {boolean} 
 */
export async function setNotificationSettings(settings) {
    await set(
        ref(
            getDatabase(),
            `users/${getAuth().currentUser.uid}/notificationSettings`
        ),
        settings
    )
        .then(() => {
            return true;
        })
        .catch(error => {
            console.log(
                "error",
                "constants/settings/nofitications.js setNotificationSettings",
                error.code
            );
            return false;
        });
}

export async function getUsersExpoPushToken(userId) {
    let token = (
        await get(child(ref(getDatabase()), `users/${userId}/expoPushToken`))
    ).val();
    return token;
}
