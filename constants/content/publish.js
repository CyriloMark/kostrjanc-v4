import { Alert } from "react-native";

//#region import Constants
import makeRequest from "../request";
import getStatusCodeText from "../../components/content/status";
import { getLangs } from "../langs";
import { getData, storeData } from "../storage";
import { sendContentUploadPushNotification } from "../notifications/content";
import addScore, { PUBLISH_SCORE_DISTRIBUTION } from "./scoring";
import { getAuth } from "firebase/auth";
//#endregion

//#region publicPost
export async function publishPost(post, fromEdit) {
    const base64 = post.imgBase64;
    if (!base64) {
        Alert.alert("Fehler", "Kein Bild ausgewählt oder Base64-Daten fehlen.");
        return;
    }

    let body = {
        type: "post",
        img: base64,
        title: post.title,
        description: post.description,
    };

    if (post.group)
        body = {
            ...body,
            group: post.group,
        };
    if (post.event)
        body = {
            ...body,
            event: post.event,
        };

    return await publishContent(body, 0, fromEdit);
}

//#region publishEvent
export async function publishEvent(event, fromEdit, checkedCategories, pin) {
    let body = {
        type: "event",
        title: event.title,
        description: event.description,
        starting: event.starting,
        ending: event.ending,
        geoCords: pin,
        eventOptions: setEventOptions(event.eventOptions, checkedCategories),
    };

    // Add Group info
    if (event.group)
        body = {
            ...body,
            group: event.group,
        };

    // If Ad Banner was selected and set
    if (
        !fromEdit &&
        event.eventOptions.adBanner !== undefined &&
        checkedCategories.adBanner
    ) {
        console.log("detected image");

        let img_url = event.eventOptions.adBanner.base64;
        const base64 = img_url;

        if (!base64)
            Alert.alert(
                "Fehler",
                "Kein Bild ausgewählt oder Base64-Daten fehlen."
            );
        else
            body = {
                ...body,
                img: base64,
            };
    }

    return await publishContent(body, 1, fromEdit);
}

//#region publishGroup
export async function publishGroup(group, fromEdit) {
    const base64 = group.imgBase64;
    if (!base64) {
        Alert.alert("Fehler", "Kein Bild ausgewählt oder Base64-Daten fehlen.");
        return;
    }

    let body = {
        id: group.name,
        name: group.name,
        description: group.description,
        members: group.members,
        img: base64,
    };

    try {
        let url = "/groups/create";
        const response = await makeRequest(url, body);

        if (response.code < 400) {
            if (!fromEdit) {
                handleNewGroupSuccess(response);
            } else handleEditGroupSuccess(response);
        } else handleGroupReject(response);
    } catch (error) {
        handleGroupReject(null);
        return false;
    }
}

async function publishContent(body, type, fromEdit) {
    try {
        let url = `/post_event/${!fromEdit ? "publish" : "edit"}`;
        const response = await makeRequest(url, body);

        if (response.code < 400) {
            if (!fromEdit) {
                handleNewContentSuccess(
                    response,
                    type,
                    type === 0 && body.group === 2
                );
                addScore(
                    getAuth().currentUser.uid,
                    type === 0
                        ? PUBLISH_SCORE_DISTRIBUTION.PUBLISH_POST
                        : PUBLISH_SCORE_DISTRIBUTION.PUBLISH_EVENT,
                    true
                );
            } else handleEditContentSuccess(response, type);
            return true;
        } else {
            handleContentReject(response, type);
            return false;
        }
    } catch (error) {
        handleContentReject(null, type);
        return false;
    }
}

//#region Alert Helpers for Post and Event publishing
function handleNewContentSuccess(response, type, isChallenge) {
    // Challenge check and ajust
    if (isChallenge && type === 0) storeData("hasUploadForChallenge", true);
    addToLocalStorage(response.id, type);
    sendContentUploadPushNotification(type);

    Alert.alert(
        getLangs(
            type === 0
                ? "postcreate_publishsuccessful_title"
                : "eventcreate_publishsuccessful_title"
        ),
        getLangs(getStatusCodeText(response.code)),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}

function handleEditContentSuccess(response, type) {
    Alert.alert(
        getLangs(
            type === 0
                ? "postcreate_editsuccessful_title"
                : "eventcreate_editsuccessful_title"
        ),
        getLangs(getStatusCodeText(response.code)),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}

function handleContentReject(response, type) {
    Alert.alert(
        getLangs(
            type === 0
                ? "postcreate_publishrejected_title"
                : "eventcreate_publishrejected_title"
        ),
        getLangs(
            getStatusCodeText(response ? response.code : type === 0 ? 450 : 460)
        ),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}
//#endregion

//#region Alert Helpers for Group publishing
function handleNewGroupSuccess(response) {
    Alert.alert(
        getLangs("groupcreate_publishsuccessful_title"),
        getLangs(getStatusCodeText(response.code)),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}

function handleEditGroupSuccess(response) {
    Alert.alert(
        getLangs("groupcreate_editsuccessful_title"),
        getLangs(getStatusCodeText(response.code)),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}

function handleGroupReject(response) {
    Alert.alert(
        getLangs("groupcreate_publishrejected_title"),
        getLangs(getStatusCodeText(response ? response.code : 404)),
        [
            {
                text: "Ok",
                isPreferred: true,
                style: "cancel",
            },
        ]
    );
}
//#endregion

//#region Helpers for Event publishing
/**
 * Filters `eventOptions` based on `checkedCategories`,
 * keeping only the allowed keys.
 *
 * @param {object} eventOptions - The original event options.
 * @param {object} checkedCategories - Boolean flags for which fields are allowed.
 * @returns {object} A filtered event options object.
 */
function setEventOptions(eventOptions = {}, checkedCategories = {}) {
    const allowedKeys = ["type", "entrance_fee", "website", "tags"];

    return allowedKeys.reduce((acc, key) => {
        if (eventOptions[key] !== undefined && checkedCategories[key]) {
            acc[key] = eventOptions[key];
        }
        return acc;
    }, {});
}
//#endregion

/**
 * Adds a post ID to the `posts` list inside `userData` in localStorage.
 *
 * Behavior:
 * - Retrieves the `userData` object from storage.
 * - Ensures `posts` is an array (initializes if missing).
 * - Appends the new `id` to `posts`.
 * - Saves the updated object back to storage.
 *
 * @param {string} id - The post ID to add.
 * @returns {Promise<void>} Resolves when the data has been updated.
 */
async function addToLocalStorage(id, type) {
    try {
        const userData = await getData("userData");
        let updatedData = userData;

        if (type === 0) {
            const posts = userData?.posts ? [...userData.posts, id] : [id];
            updatedData = {
                ...userData,
                posts: posts,
            };
        } else if (type === 1) {
            const events = userData?.events ? [...userData.events, id] : [id];
            updatedData = {
                ...userData,
                events: events,
            };
        }

        await storeData("userData", updatedData);

        console.log("Post added to localStorage");
    } catch (error) {
        console.error("Failed to add post to localStorage:", error);
    }
}
