import { sendPushNotification } from ".";
import {
    getNotificationSettings,
    getUsersExpoPushToken,
} from "../settings/notifications";

import { getLangsSpecific } from "../langs";
import { getData } from "../storage";

export async function sendContentUploadPushNotification(contentType) {
    // Get Username and followerList of Client
    const userData = await getData("userData");
    const username = userData
        ? userData.name
        : getLangsSpecific("notification_follower_alt_newuser", settings.lang);
    const followers = userData ? userData.follower : [];
    console.log(followers);

    for (let i = 0; i < followers.length; i++) {
        // Load ExpoPushToken
        const token = await getUsersExpoPushToken(followers[i]);

        // Load follower notification settings
        const settings = await getNotificationSettings(followers[i]);
        if (settings.contents && token !== null)
            sendPushNotification(
                token,
                getLangsSpecific("notification_contents_title", settings.lang),
                username +
                    (contentType == 0
                        ? getLangsSpecific(
                              "notification_contents_body_post",
                              settings.lang
                          )
                        : getLangsSpecific(
                              "notification_contents_body_event",
                              settings.lang
                          )),
                {}
            );
    }
}
