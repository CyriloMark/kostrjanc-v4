import { sendPushNotification } from ".";
import {
    getNotificationSettings,
    getUsersExpoPushToken,
} from "../settings/notifications";

import { getLangsSpecific } from "../langs";
import { getData } from "../storage";

let LAST_FOLLOWED_USER_ID = null;

export async function sendFollowerPushNotification(followerId, senderId) {
    if (LAST_FOLLOWED_USER_ID == followerId) return;
    LAST_FOLLOWED_USER_ID = followerId;

    // const token = await getUsersExpoPushToken(getAuth().currentUser.uid);
    const token = await getUsersExpoPushToken(followerId);

    // No token => no notification
    if (token === null) return false;

    // Load follower notification settings
    const settings = await getNotificationSettings(followerId);
    if (!settings.follower) return false;

    // Get Username of Client
    const userData = await getData("userData");
    const username = userData
        ? userData.name
        : getLangsSpecific("notification_follower_alt_newuser", settings.lang);

    sendPushNotification(
        token,
        getLangsSpecific("notification_follower_title", settings.lang),
        username +
            getLangsSpecific("notification_follower_body", settings.lang),
        {
            route: "profileView",
            params: {
                id: senderId,
            },
        }
    );
}
