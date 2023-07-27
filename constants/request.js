import { getAuth } from "firebase/auth";

const SERVER_URL = "http://192.168.178.104:8080";

const makeRequest = (url, body) => {
  return new Promise((resolve, reject) => {
    getAuth()
      .currentUser.getIdToken()
      .then((token) => {
        fetch(`${SERVER_URL}${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...body, token: token }),
        })
          .then((rsp) => {
            rsp
              .json()
              .then((data) => {
                resolve(data);
              })
              .catch((e) => {
                reject(e);
              });
          })
          .catch((e) => {
            reject(e);
          });
      });
  });
};

export default makeRequest;
