import { Alert } from "react-native";

//#region import Constants
import makeRequest from "../request";
import { getLangs } from "../langs";
import { getData } from "../storage";
import { sendFollowerPushNotification } from "../notifications/follower";

/**
 *
 * @param {Object} user User object
 * @param {String} user.name Profile name of user
 * @param {boolean} user.isAdmin Whether user is admin
 * @param {boolean} user.isMod Whether user is Moderator
 * @param {boolean} user.isMK Whether user is an official Młodźinski club Account
 */
export function alertForRoles(user) {
    Alert.alert(
        user.name,
        `${user.name} ${getLangs("profile_role_sub_0")} ${
            user.isAdmin
                ? getLangs("profile_role_admin")
                : user.isMod
                ? getLangs("profile_role_mod")
                : user.isMK
                ? getLangs("profile_role_mk")
                : ""
        } ${getLangs("profile_role_sub_1")}`
    );
}

export async function getIfClientIsAdmin() {
    try {
        const adm = await getData("userIsAdmin");
        return adm !== null ? adm : false;
    } catch (e) {
        return false;
    }
}

let LAST_FOLLOWED_UID = null;
/**
 *
 * @param {String} id User Id of User to follow
 * @param {boolean} unfollow Default `false`
 * @param {String} UID User Id of Client
 */
export async function followUser(id, unfollow, UID) {
    function handleFollowError(rsp) {
        Alert.alert(
            getLangs("profile_onfollow_error_title"),
            getLangs("profile_onfollow_error_sub") + rsp,
            [
                {
                    isPreferred: true,
                    text: "Ok",
                    style: "default",
                },
            ]
        );
    }

    try {
        const body = {
            user: id,
            follow: !unfollow,
            unfollow: unfollow,
        };

        const rsp = await makeRequest("/user/follow", body);

        // Follow Error
        if (rsp.code !== 202) {
            handleFollowError(rsp);
            return false;
        }

        // Follow Notification
        if (LAST_FOLLOWED_UID !== id) {
            LAST_FOLLOWED_UID = id;
            sendFollowerPushNotification(id, UID);
        }

        return true;
    } catch (e) {
        handleFollowError(e);
        return false;
    }
}
