import { Alert } from "react-native";

import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getDatabase, set, ref, child, get } from "firebase/database";
import * as Storage from "firebase/storage";

// import Constants
import { getAuthErrorMsg } from "../../constants/error/auth";
import { removeData } from "../../constants/storage";
import { getLangs } from "../../constants/langs";
import { makeRequest } from "../../constants/request";

import { setStringAsync } from "expo-clipboard";

export function logout() {
    Alert.alert(
        getLangs("auth_logout_0_title"),
        getLangs("auth_logout_0_sub"),
        [
            {
                text: getLangs("no"),
                style: "destructive",
            },
            {
                text: getLangs("yes"),
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

/*
    Obsolete
*/
export function deleteAccount_old(uid, userData) {
    Alert.alert(
        getLangs("auth_delete_0_title"),
        getLangs("auth_delete_0_sub"),
        [
            {
                text: getLangs("no"),
                style: "destructive",
            },
            {
                text: getLangs("yes"),
                style: "default",
                onPress: () => {
                    Alert.alert(getLangs("auth_delete_1_title"), "", [
                        {
                            text: getLangs("no"),
                            style: "destructive",
                        },
                        {
                            text: getLangs("yes"),
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
                                    Storage.ref(storage, `profile_pics/${uid}`)
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
                    ]);
                },
            },
        ]
    );
}

/*
    Use this :)
    old removes whole user
    this fkt set user as isBanned and removes his entry in Auth
*/
export function deleteAccount(uid, userData) {
    Alert.alert(
        getLangs("auth_delete_0_title"),
        getLangs("auth_delete_0_sub"),
        [
            {
                text: getLangs("no"),
                style: "destructive",
            },
            {
                text: getLangs("yes"),
                style: "default",
                onPress: () => {
                    Alert.alert(getLangs("auth_delete_1_title"), "", [
                        {
                            text: getLangs("no"),
                            style: "destructive",
                        },
                        {
                            text: getLangs("yes"),
                            style: "default",
                            onPress: () => {
                                const db = getDatabase();

                                //#region Remove Follower/-ing
                                if (userData.follower)
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
                                                    newList.indexOf(uid),
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
                                if (userData.following)
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
                                                    newList.indexOf(uid),
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
                                //#endregion

                                //#region Remove Posts & Events
                                if (userData.posts) {
                                    userData.posts.forEach(post =>
                                        set(
                                            ref(db, `posts/${post}/isBanned`),
                                            true
                                        ).catch(error =>
                                            console.log(
                                                "error comps/settings/index.js",
                                                "deleteAccount delete Posts",
                                                error.code
                                            )
                                        )
                                    );
                                }
                                if (userData.events) {
                                    userData.events.forEach(event =>
                                        set(
                                            ref(db, `events/${event}/isBanned`),
                                            true
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

                                set(ref(db, `users/${uid}/isDeleted`), true)
                                    .then(() => {
                                        // Add User to deleted Users
                                        get(child(ref(db), `deleted_users`))
                                            .then(deletedUsers => {
                                                let list = [];
                                                if (deletedUsers.exists())
                                                    list = deletedUsers.val();
                                                list.push({
                                                    id: uid,
                                                    email: getAuth().currentUser
                                                        .email,
                                                    deleted: Date.now(),
                                                });
                                                set(
                                                    ref(db, `deleted_users`),
                                                    list
                                                )
                                                    .finally(() => {
                                                        // Remove Cached User Data
                                                        removeData("userId");
                                                        removeData("userData");
                                                        // Delete User in Auth
                                                        deleteUser(
                                                            getAuth()
                                                                .currentUser
                                                        )
                                                            .then(() =>
                                                                Alert.alert(
                                                                    "Konto je so wuspěšnje wotstronił.",
                                                                    "",
                                                                    [
                                                                        {
                                                                            style: "default",
                                                                            text: "Ok",
                                                                        },
                                                                    ]
                                                                )
                                                            )
                                                            .catch(error =>
                                                                console.log(
                                                                    "error comps/settings/index.js",
                                                                    "deleteAccount delete User",
                                                                    error.code
                                                                )
                                                            );
                                                    })
                                                    .catch(error =>
                                                        console.log(
                                                            "error comps/settings/index.js",
                                                            "deleteAccount set User in deleted_users",
                                                            error.code
                                                        )
                                                    );
                                            })
                                            .catch(error =>
                                                console.log(
                                                    "error comps/settings/index.js",
                                                    "deleteAccount get deleted_users",
                                                    error.code
                                                )
                                            );
                                    })
                                    .catch(error =>
                                        console.log(
                                            "error comps/settings/index.js",
                                            "deleteAccount set isBanned User",
                                            error.code
                                        )
                                    );
                            },
                        },
                    ]);
                },
            },
        ]
    );
}

export function setServer(opt) {
    const db = getDatabase();

    let offline = () => {
        Alert.alert(
            getLangs("auth_server_offline_0_title"),
            getLangs("auth_server_offline_0_sub"),
            [
                {
                    style: "destructive",
                    text: getLangs("no"),
                    isPreferred: true,
                },
                {
                    style: "default",
                    text: getLangs("yes"),
                    onPress: () => {
                        Alert.prompt(
                            getLangs("auth_server_offline_1_title"),
                            getLangs("auth_server_offline_1_sub"),
                            [
                                {
                                    style: "destructive",
                                    text: getLangs("no"),
                                    isPreferred: true,
                                },
                                {
                                    style: "default",
                                    text: getLangs("continue"),
                                    onPress: input => {
                                        if (input === "offline")
                                            set(ref(db, `status`), "offline")
                                                .finally(() => {
                                                    Alert.alert(
                                                        getLangs(
                                                            "auth_server_offline_successful"
                                                        ),
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
            getLangs("auth_server_pause_0_title"),
            getLangs("auth_server_pause_0_sub"),
            [
                {
                    style: "destructive",
                    text: getLangs("no"),
                    isPreferred: true,
                },
                {
                    style: "default",
                    text: getLangs("yes"),
                    onPress: () => {
                        Alert.prompt(
                            getLangs("auth_server_pause_1_title"),
                            getLangs("auth_server_pause_1_sub"),
                            [
                                {
                                    style: "destructive",
                                    text: getLangs("no"),
                                    isPreferred: true,
                                },
                                {
                                    style: "default",
                                    text: getLangs("continue"),
                                    onPress: time => {
                                        Alert.prompt(
                                            `${getLangs(
                                                "auth_server_pause_2_title_0"
                                            )} ${time} ${getLangs(
                                                "auth_server_pause_2_title_1"
                                            )}`,
                                            getLangs("auth_server_pause_2_sub"),
                                            [
                                                {
                                                    style: "destructive",
                                                    text: getLangs("no"),
                                                    isPreferred: true,
                                                },
                                                {
                                                    style: "default",
                                                    text: getLangs("continue"),
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
                                                                        getLangs(
                                                                            "auth_server_pause_successful"
                                                                        ),
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
    Alert.alert(getLangs("auth_copyid_successful"), "id: " + uid, [
        {
            text: "Ok",
            style: "cancel",
        },
    ]);
}

export async function refreshEventRanking() {
    Alert.alert(getLangs("auth_eventranking_title"), "", [
        {
            style: "destructive",
            text: getLangs("no"),
            isPreferred: true,
        },
        {
            style: "default",
            text: getLangs("yes"),
            onPress: async () => {
                console.log("refreshEventRanking");
                return;
                const response = await makeRequest("", null);
                if (response.status == "accepted")
                    Alert.alert(getLangs("auth_eventranking_success"), "", [
                        {
                            text: "Ok",
                            style: "default",
                            isPreferred: true,
                        },
                    ]);
                else
                    Alert.alert(getLangs("auth_eventranking_error"), "", [
                        {
                            text: "Ok",
                            style: "default",
                            isPreferred: true,
                        },
                    ]);
            },
        },
    ]);
}
