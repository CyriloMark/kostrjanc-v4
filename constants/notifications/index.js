import { child, get, getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";

export async function registerForPushNotificationsAsync() {
    if (!isDevice) {
        console.log("Push Notifications benötigen ein physisches Gerät!");
        return;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Keine Berechtigung für Push Notifications!");
        return;
    }

    const projectId = require("../../app.json").expo.extra.eas.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;

    const expoPushToken = (
        await get(
            child(
                ref(getDatabase()),
                "users/" + getAuth().currentUser.uid + "/expoPushToken"
            )
        )
    ).val();

    if (expoPushToken != token)
        set(
            ref(
                getDatabase(),
                "users/" + getAuth().currentUser.uid + "/expoPushToken"
            ),
            token
        );

    return token;
}

/**
 *
 * @param {string} expoPushToken
 * @param {string} title
 * @param {string} body
 * @param {object} data
 */
export async function sendPushNotification(
    expoPushToken,
    title,
    body,
    data = {}
) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title,
        body,
        data,
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
}
