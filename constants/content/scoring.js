import { get, child, getDatabase, ref, set } from "firebase/database";
import { Alert } from "react-native";
import { getLangs } from "../langs";

const SCORING_ENABLED = true;
const CHALLENGE_SCORE_DISTRIBUTION = [100, 66, 50, 33, 25];
export const PUBLISH_SCORE_DISTRIBUTION = {
    PUBLISH_POST: 25,
    PUBLISH_EVENT: 50,
    COMMENT: 5,
};

/**
 * Increments a user's score in the database.
 *
 * Behavior:
 * - Reads the current score for the given `userId`.
 * - Defaults to `0` if no score exists.
 * - Adds `scoreToAdd` to it.
 * - Updates the score in the database.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} scoreToAdd - The number of points to add.
 * @param {boolean} rewardMsg - Whether user should get rewarded with message
 * @returns {Promise<number>} - The updated score.
 */
export default async function addScore(userId, scoreToAdd, rewardMsg) {
    if (!SCORING_ENABLED) return;

    const db = getDatabase();

    try {
        // Fetch current score (default 0 if null)
        const snapshot = await get(child(ref(db), `users/${userId}/score`));
        const currentScore = snapshot.val() ?? 0;

        // Calculate updated score
        const newScore = currentScore + scoreToAdd;

        // Save updated score
        await set(ref(db, `users/${userId}/score`), newScore);

        if (rewardMsg) {
            Alert.alert(
                `+${scoreToAdd}${getLangs("score_update_title")}`,
                `${getLangs("score_update_sub_1")}${newScore}${getLangs(
                    "score_update_sub_2"
                )}.`,
                [
                    {
                        text: "Ok",
                        style: "default",
                        isPreferred: true,
                    },
                ]
            );
        }

        return newScore;
    } catch (error) {
        console.error(
            "Failed to update user score:",
            { userId, scoreToAdd },
            error
        );
        throw error; // rethrow so caller can handle
    }
}

/**
 *
 * @param {Array} topPosts
 */
export async function handleChallengeScoring(topPosts) {
    for (let i = 0; i < topPosts.length; i++)
        await addScore(
            topPosts[i].creator,
            CHALLENGE_SCORE_DISTRIBUTION[i],
            false
        );
}
