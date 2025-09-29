// import Firebase
import { getDatabase, ref, get, child, set } from "firebase/database";
import { handleChallengeScoring } from "../content/scoring";

const Challenge_Post_Result_Placeholder = {
    creator: "",
    userName: "",
    id: -1,
    likes: -1,
    imgUri: "",
};

const WINNING_AMT = 5;

//#region Fkt: generateChallengeResult
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

//#region Fkt: getChallengePostsAndLikes
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

//#region Fkt: getChallengePosts
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

//#region Fkt: getWinningPosts
/**
 * Returns the top posts based on number of likes.
 *
 * Behavior:
 * - Sorts posts in descending order by `likes.length`.
 * - Returns only the first `WINNING_AMT` posts.
 * - Does not mutate the original array.
 *
 * @param {Challenge_Post_Result_Placeholder[]} posts - List of post objects, each with a `likes` array.
 * @returns {Array} - Top posts limited to `WINNING_AMT`.
 */
function getWinningPosts(posts) {
    return [...posts] // copy to avoid mutating input
        .sort((a, b) => b.likes.length - a.likes.length)
        .slice(0, WINNING_AMT);
}

//#region Fkt: getWinningUserNames
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

//#region Fkt: resetChallenge
export async function resetChallenge(topPosts) {
    // Database Reference
    const db = getDatabase();

    const posts = await getChallengePosts(ref(db));
    await handleChallengeScoring(topPosts);

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
