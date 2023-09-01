import { getAuth } from "firebase/auth";
import { Alert } from "react-native";

const makeRequest = (url, body) => {
    return new Promise((resolve, reject) => {
        getAuth()
            .currentUser.getIdToken()
            .then(token => {
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}${url}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...body, token: token }),
                })
                    .then(rsp => {
                        Alert.alert(`rsp.ok: ${rsp.ok}`, "Ok", [
                            { isPreferred: true, text: "Ok", style: "default" },
                        ]);
                        rsp.json()
                            .then(data => {
                                resolve(data);
                            })
                            .catch(e => {
                                reject(e);
                            });
                    })
                    .catch(e => {
                        Alert.alert(`e: ${e}`, "Error", [
                            { isPreferred: true, text: "Ok", style: "default" },
                        ]);
                        reject(e);
                    });
            });
    });
};

export default makeRequest;
