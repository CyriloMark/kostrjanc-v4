import { getAuth, updateProfile } from "firebase/auth";

export function getNotificationSettings() {
    const data = JSON.parse(getAuth().currentUser.displayName);
    if (data === null)
        return {
            follower: false,
            contents: false,
            comments: false,
            eventStart: false,
        };
    return data;
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
