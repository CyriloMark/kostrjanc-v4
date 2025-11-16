import { getDatabase, ref, set } from "firebase/database";

import { getUID } from "../storage";
import { sendCommentPushNotification } from "../notifications/comments";
import addScore, { PUBLISH_SCORE_DISTRIBUTION } from "./scoring";

/**
 * Function for publishing new text comment
 * @param {number} id Id of Content
 * @param {String} input Content of text comment
 * @param {Array<Object>} commentsList Current list of published comments
 * @param {Object} content Content data of post or event
 * @param {String} content.creator Id of post/event creator
 * @param {String} content.title Title of post/event
 * @param {number} contentType ```0 - Post | 1 - Event```
 * @returns {Promise<Array<Object>>} New list
 */
export async function publishComment(
    id,
    input,
    commentsList,
    content,
    contentType
) {
    const UID = await getUID();

    let newList = [
        {
            creator: UID,
            created: Date.now(),
            content: input,
            type: "t",
        },
    ].concat(commentsList);

    try {
        // Fetch to Firebase
        await set(
            ref(
                getDatabase(),
                `${contentType === 0 ? "posts" : "events"}/${id}/comments`
            ),
            newList
        );

        // Handle User Score and Notifications
        if (UID !== content.creator) {
            sendCommentPushNotification(
                id,
                content.creator,
                contentType,
                content.title
            );
            addScore(UID, PUBLISH_SCORE_DISTRIBUTION.COMMENT, true);
        }

        return newList;
    } catch (e) {
        console.log("error in publishComment()");
        return commentsList;
    }
}

/**
 * Function for deleting text comment
 * @param {number} id Id of Content
 * @param {Object} comment Comment to delete
 * @param {Array<Object>} commentsList Current list of published comments
 * @param {number} contentType ```0 - Post | 1 - Event```
 * @returns {Promise<Array<Object>>} New list
 */
export async function deleteComment(id, comment, commentsList, contentType) {
    try {
        let newList = commentsList.filter(c => c !== comment);

        // Fetch to Firebase
        set(
            ref(
                getDatabase(),
                `${contentType === 0 ? "posts" : "events"}/${id}/comments`
            ),
            newList
        );

        return newList;
    } catch (e) {
        console.log("error in removeComment()");
        return commentsList;
    }
}
