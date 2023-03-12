import { getLangs } from "../langs";

export const getAuthErrorMsg = error => {
    let msg = "";
    switch (error) {
        case "auth/already-initialized":
            msg = getLangs("auth_errormsg_0");
            break;
        case "auth/credential-already-in-use":
            msg = getLangs("auth_errormsg_1");
            break;
        case "auth/email-already-in-use":
            msg = getLangs("auth_errormsg_2");
            break;
        case "auth/internal-error":
            msg = getLangs("auth_errormsg_3");
            break;
        case "auth/invalid-user-token":
            msg = getLangs("auth_errormsg_4");
            break;
        case "auth/invalid-email":
            msg = getLangs("auth_errormsg_5");
            break;
        case "auth/wrong-password":
            msg = getLangs("auth_errormsg_6");
            break;
        case "auth/unverified-email":
            msg = getLangs("auth_errormsg_7");
            break;
        case "auth/user-not-found":
            msg = getLangs("auth_errormsg_8");
            break;
        case "auth/user-disabled":
            msg = getLangs("auth_errormsg_9");
            break;
        case "auth/already-initialized":
            msg = getLangs("auth_errormsg_10");
            break;
        case "auth/missing-email":
            msg = getLangs("auth_errormsg_11");
            break;
        default:
            msg = error;
            break;
    }
    return msg;
};
