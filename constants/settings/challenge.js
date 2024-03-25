// import Firebase
import { getDatabase, ref, get, child, set } from "firebase/database";

const Challenge_Post_Result_Placeholder = {
    creator: "",
    userName: "",
    id: -1,
    likes: -1,
    imgUri: "",
};

const WINNING_AMT = 5;

export async function generateChallengeResult() {
    console.log("generateChallengeResult");

    // Database Reference
    const db = ref(getDatabase());

    // Fetches all Posts from Group with necessary Data
    const posts = await getChallengePostsAndLikes(db);

    // Calculates Winning Posts
    getWinningPosts(posts);

    await getWinningUserNames(db, posts);

    return posts;
}

/**
 *
 * @param {String} db Reference to Firebase Database
 * @returns {Challenge_Post_Result_Placeholder}
 */
async function getChallengePostsAndLikes(db) {
    let posts = await getChallengePosts(db);

    let output = [];
    for (let i = 0; i < posts.length; i++) {
        const p = (await get(child(db, `posts/${posts[i]}`))).val();
        if (p !== null)
            output.push({
                userName: null,
                creator: p.creator,
                id: p.id,
                likes: p.likes ? p.likes : [],
                imgUri: p.imgUri,
            });
    }

    return output;
}

/**
 * Fetches all Posts from Challenge
 * @param {String} db Reference to Firebase Database
 * @returns {number[]} List of Post Ids
 */
async function getChallengePosts(db) {
    let posts = (await get(child(db, `groups/2/posts`))).val();
    if (posts === null) return [];
    return posts;
}

/**
 *
 * @param {Challenge_Post_Result_Placeholder[]} posts List of Posts with Data
 */
function getWinningPosts(posts) {
    posts.forEach(p => console.log(p.likes.length));
    posts.sort((a, b) => b.likes.length - a.likes.length);
    posts.forEach(p => console.log(p.likes.length));
    posts.splice(WINNING_AMT);
}

/**
 *
 * @param {String} db Reference to Firebase Database
 * @param {Challenge_Post_Result_Placeholder[]} posts List of Posts with Data
 */
async function getWinningUserNames(db, posts) {
    for (let i = 0; i < posts.length; i++) {
        const name = (
            await get(child(db, `users/${posts[i].creator}/name`))
        ).val();
        posts[i].userName = name ? name : "kostrjanc wužiwar";
    }
}

export async function resetChallenge(topPosts) {
    // Database Reference
    const db = getDatabase();

    const posts = await getChallengePosts(ref(db));

    await handleScoringOnReset(db, topPosts);

    posts.forEach(
        async id =>
            await set(ref(db, `posts/${id}/group`), null).catch(error =>
                console.log(
                    "error in constants/settings/challenge",
                    "resetChallenge set posts",
                    error.code
                )
            )
    );

    await set(ref(db, `groups/2/posts`), null).catch(error =>
        console.log(
            "error in constants/settings/challenge",
            "resetChallenge set group",
            error.code
        )
    );
}

const SCORE_DISTRIBUTION = [100, 66, 50, 33, 25];

/**
 *
 * @param {String} db Firebase Database
 * @param {Challenge_Post_Result_Placeholder[]} topPosts List of Winning
 */
async function handleScoringOnReset(db, topPosts) {
    for (let i = 0; i < topPosts.length; i++)
        await overrideUserScore(topPosts[i].creator, SCORE_DISTRIBUTION[i], db);
}

/**
 * Overrides a Score in User's Profile
 * @param {String} userId Id of User
 * @param {number} scoreToAdd Score to Add
 * @param {String} db Firebase Database
 */
async function overrideUserScore(userId, scoreToAdd, db) {
    // Get Current Score
    let currentScore = (
        await get(child(ref(db), `users/${userId}/score`))
    ).val();
    if (currentScore === null) currentScore = 0;

    // Add new Score
    currentScore += scoreToAdd;

    // Override Score
    await set(ref(db, `users/${userId}/score`), currentScore).catch(error =>
        console.log(
            "error in constants/settings/challenge",
            "overrideUserScore set score",
            error.code
        )
    );
}
