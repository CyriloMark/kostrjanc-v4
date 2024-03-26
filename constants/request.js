import { getAuth } from "firebase/auth";
import { Alert } from "react-native";

/**
 *
 * @param {string} url API URL
 * @param {object} body Body of "POST" API Request
 * @returns
 */
const makeRequest = (url, body) => {
    return new Promise((resolve, reject) => {
        getAuth()
            .currentUser.getIdToken()
            .then((token) => {
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}${url}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...body,
                        token: url == "/post_event/check_words" ? null : token,
                    }),
                })
                    .then((rsp) =>
                        rsp
                            .json()
                            .then((data) => {
                                resolve(data);
                                // console.log(data);
                            })
                            .catch((e) => {
                                reject(e);
                            })
                    )
                    .catch((e) => {
                        reject(e);
                    });
            });
    });
};

export default makeRequest;
