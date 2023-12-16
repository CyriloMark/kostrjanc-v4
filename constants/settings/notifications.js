import { getAuth, updateProfile } from "firebase/auth";

export function getNotificationSettings() {
    return JSON.parse(getAuth().currentUser.displayName);
}

/**
 * Format:
 *  Exp.: {
 *      follower: true,
        contents: false,
        comments: false,
        eventStart: true,
 * }
 * @param {*} settings
 */
export async function setNotificationSettings(settings) {
    const output = JSON.stringify(settings);
    await updateProfile(getAuth().currentUser, {
        displayName: output,
    })
        .then(res => {
            return true;
        })
        .catch(error => {
            console.log(
                "error constants/settings/notifications.jsx",
                "setNotificationSettings",
                error.code
            );
            return false;
        });
}
