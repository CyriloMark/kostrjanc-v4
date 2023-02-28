import { Alert } from "react-native";

import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getDatabase, set, ref, child, get } from "firebase/database";
import * as Storage from "firebase/storage";

import { getAuthErrorMsg } from "../../constants/error/auth";
import { removeData } from "../../constants/storage";

import { setStringAsync } from "expo-clipboard";

export function logout() {
    Alert.alert(
        "Wotzjewić?",
        "Chceš ty so woprawdźe z twojeho konta wotzjewić?",
        [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    signOut(getAuth()).catch(error => {
                        Alert.alert(getAuthErrorMsg(error.code));
                        console.log("error logout", error.code);
                    });
                    removeData("userId");
                    removeData("userData");
                },
            },
        ]
    );
}

export function deleteAccount(uid, userData) {
    Alert.alert(
        "Konto wotstronić?",
        "Chceš ty woprawdźe twój konto wotstronić?",
        [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    Alert.alert(
                        "Sy sej woprawdźe wěsty, twój konto je za přeco fuk!",
                        "",
                        [
                            {
                                text: "Ně",
                                style: "destructive",
                            },
                            {
                                text: "Haj",
                                style: "default",
                                onPress: () => {
                                    const db = getDatabase();
                                    const storage = Storage.getStorage();

                                    //#region Remove Follower/-ing
                                    if (userData.follower) {
                                        userData.follower.forEach(user =>
                                            get(
                                                child(
                                                    ref(db),
                                                    `users/${user}/following`
                                                )
                                            )
                                                .then(followingSnap => {
                                                    let newList =
                                                        followingSnap.val();
                                                    newList.splice(
                                                        a.indexOf(uid),
                                                        1
                                                    );
                                                    set(
                                                        ref(
                                                            db,
                                                            `users/${user}/following`
                                                        ),
                                                        newList
                                                    ).catch(error =>
                                                        console.log(
                                                            "error comps/settings/index.js",
                                                            "deleteAccount remove follower users",
                                                            error.code
                                                        )
                                                    );
                                                })
                                                .catch(error =>
                                                    console.log(
                                                        "error comps/settings/index.js",
                                                        "deleteAccount get follower users",
                                                        error.code
                                                    )
                                                )
                                        );
                                    }
                                    if (userData.following) {
                                        userData.following.forEach(user =>
                                            get(
                                                child(
                                                    ref(db),
                                                    `users/${user}/follower`
                                                )
                                            )
                                                .then(followerSnap => {
                                                    let newList =
                                                        followerSnap.val();
                                                    newList.splice(
                                                        a.indexOf(uid),
                                                        1
                                                    );
                                                    set(
                                                        ref(
                                                            db,
                                                            `users/${user}/follower`
                                                        ),
                                                        newList
                                                    ).catch(error =>
                                                        console.log(
                                                            "error comps/settings/index.js",
                                                            "deleteAccount remove Following users",
                                                            error.code
                                                        )
                                                    );
                                                })
                                                .catch(error =>
                                                    console.log(
                                                        "error comps/settings/index.js",
                                                        "deleteAccount get following users",
                                                        error.code
                                                    )
                                                )
                                        );
                                    }
                                    //#endregion

                                    //#region Remove Posts & Events
                                    if (userData.posts) {
                                        userData.posts.forEach(post => {
                                            set(
                                                ref(db, `posts/${post}`),
                                                null
                                            ).catch(error =>
                                                console.log(
                                                    "error comps/settings/index.js",
                                                    "deleteAccount delete Posts",
                                                    error.code
                                                )
                                            );
                                            Storage.deleteObject(
                                                Storage.ref(
                                                    storage,
                                                    `posts_pics/${post}`
                                                )
                                            );
                                        });
                                    }
                                    if (userData.events) {
                                        userData.events.forEach(event =>
                                            set(
                                                ref(db, `events/${event}`),
                                                null
                                            ).catch(error =>
                                                console.log(
                                                    "error comps/settings/index.js",
                                                    "deleteAccount delete Events",
                                                    error.code
                                                )
                                            )
                                        );
                                    }
                                    //#endregion

                                    Storage.deleteObject(
                                        Storage.ref(
                                            storage,
                                            `profile_pics/${uid}`
                                        )
                                    ).catch(error =>
                                        console.log(
                                            "error comps/settings/index.js",
                                            "deleteAccount delete user pb pic",
                                            error.code
                                        )
                                    );

                                    set(ref(db, `users/${uid}`), null)
                                        .finally(() => {
                                            deleteUser(getAuth().currentUser);
                                            removeData("userId");
                                            removeData("userData");
                                        })
                                        .catch(error =>
                                            console.log(
                                                "error comps/settings/index.js",
                                                "deleteAccount delete User",
                                                error.code
                                            )
                                        );
                                },
                            },
                        ]
                    );
                },
            },
        ]
    );
}

export function setServer(opt) {
    const db = getDatabase();

    let offline = () => {
        Alert.alert(
            "Chceš serwer na 'offline' stajić?",
            "Chceš woprawdźe serwer hasnyć? Po tym nichtó wjac přistup na serwer nima",
            [
                {
                    style: "destructive",
                    text: "Ně",
                    isPreferred: true,
                },
                {
                    style: "default",
                    text: "Haj",
                    onPress: () => {
                        Alert.prompt(
                            "Chceš WOPRAWDŹE serwer na 'offline' sadźić?",
                            "Zapodaj 'offline'",
                            [
                                {
                                    style: "destructive",
                                    text: "Ně",
                                    isPreferred: true,
                                },
                                {
                                    style: "default",
                                    text: "Haj",
                                    onPress: input => {
                                        if (input === "offline")
                                            set(ref(db, `status`), "offline")
                                                .finally(() => {
                                                    Alert.alert(
                                                        "Serwer je so wuspěšnje na 'offline' sadźił.",
                                                        "",
                                                        [
                                                            {
                                                                text: "Ok",
                                                                style: "cancel",
                                                                isPreferred: true,
                                                            },
                                                        ]
                                                    );
                                                })
                                                .catch(error =>
                                                    console.log(
                                                        "error comps/settings/index.js",
                                                        "set server - offline set server offline",
                                                        error.code
                                                    )
                                                );
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    let pause = () => {
        Alert.alert(
            "Chceš serwer na 'pause' stajić?",
            "Chceš woprawdźe serwer hasnyć? Po tym nichtó wjac přistup na serwer nima",
            [
                {
                    style: "destructive",
                    text: "Ně",
                    isPreferred: true,
                },
                {
                    style: "default",
                    text: "Haj",
                    onPress: () => {
                        Alert.prompt(
                            "Kak dółho budźe serwer hasnjeny?",
                            "Zapodaj čas, kak dółho ma serwer hasnjeny być. Prošu mysli na to, zo ma so serwer manuelnje zaso na online sadźić!",
                            [
                                {
                                    style: "destructive",
                                    text: "Ně",
                                    isPreferred: true,
                                },
                                {
                                    style: "default",
                                    text: "Dale",
                                    onPress: time => {
                                        Alert.prompt(
                                            `Chceš WOPRAWDŹE serwer na 'pause' za ${time} sadźić?`,
                                            "Zapodaj 'pause'",
                                            [
                                                {
                                                    style: "destructive",
                                                    text: "Ně",
                                                    isPreferred: true,
                                                },
                                                {
                                                    style: "default",
                                                    text: "Haj",
                                                    onPress: input => {
                                                        if (input === "pause")
                                                            set(
                                                                ref(
                                                                    db,
                                                                    `status`
                                                                ),
                                                                `pause/${time}/${Date.now()}`
                                                            )
                                                                .finally(() => {
                                                                    Alert.alert(
                                                                        "Serwer je so wuspěšnje na 'pause' sadźił.",
                                                                        "",
                                                                        [
                                                                            {
                                                                                text: "Ok",
                                                                                style: "cancel",
                                                                                isPreferred: true,
                                                                            },
                                                                        ]
                                                                    );
                                                                })
                                                                .catch(error =>
                                                                    console.log(
                                                                        "error comps/settings/index.js",
                                                                        "set server - pause set server pause",
                                                                        error.code
                                                                    )
                                                                );
                                                    },
                                                },
                                            ]
                                        );
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    switch (opt) {
        case "offline":
            offline();
            break;
        case "pause":
            pause();
            break;
        default:
            break;
    }
}

export async function copyUIDToClipboard(uid) {
    setStringAsync(uid);
    Alert.alert("Twoja id je so kopěrowała!", "id: " + uid, [
        {
            text: "Ok",
            style: "cancel",
        },
    ]);
}
