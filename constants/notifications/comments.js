import { sendPushNotification } from ".";
import {
    getNotificationSettings,
    getUsersExpoPushToken,
} from "../settings/notifications";

import { getLangsSpecific } from "../langs";
import { getData } from "../storage";
import { getAuth } from "firebase/auth";

/**
 *
 * @param {string} creatorId UID of Creator
 * @param {number} contentType 0: Post | 1: Event
 * @param {*} contentTitle
 * @returns
 */
export async function sendCommentPushNotification(
    creatorId,
    contentType,
    contentTitle
) {
    // Check if Commenter is same as content publisher
    if (getAuth().currentUser.uid == creatorId) return false;

    // const token = await getUsersExpoPushToken(getAuth().currentUser.uid);
    const token = await getUsersExpoPushToken(creatorId);

    // No token => no notification
    if (token === null) return false;

    // Load follower notification settings
    const settings = await getNotificationSettings(creatorId);
    if (!settings.comments) return false;

    sendPushNotification(
        token,
        getLangsSpecific("notification_comments_title", settings.lang),
        `${
            contentType == 0
                ? getLangsSpecific(
                      "notification_comments_body_post",
                      settings.lang
                  )
                : getLangsSpecific(
                      "notification_comments_body_event",
                      settings.lang
                  )
        } "${contentTitle}"`,
        {}
    );
}
