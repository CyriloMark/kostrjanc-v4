/**
 *
 * @param {string} input Current Input to extract last word
 */
function getCurrentWord(input) {
    const split = input.split(" ");
    return split[split.length - 1];
}

/**
 *
 * @param {string} input Current Input to find correct Alternatives
 * @returns {object} Object with Status Code and String Array of correct Alternatives
 */
export default async function checkForAutoCorrect(input) {
    let output = {
        status: 0,
        content: [],
    };

    const word = getCurrentWord(input);
    if (word.length < 2) {
        output.status = 200;
        return output;
    } else {
        await fetch(process.env.EXPO_PUBLIC_SPELL_CHECK_URL, {
            body: JSON.stringify({ word: word }),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(rsp =>
                rsp
                    .json()
                    .then(words => {
                        if (words.length === 0) output.status = 200;
                        else
                            output = {
                                status: 300,
                                content: words,
                            };
                    })
                    .catch(error => {
                        console.log(
                            "error constants/content/autoCorrect.js",
                            "error requestWords rsp.json()",
                            error
                        );
                    })
            )
            .catch(error => {
                console.log(
                    "error constants/content/autoCorrect.js",
                    "error requestWords fetch",
                    error
                );
            });

        return output;
    }
}
