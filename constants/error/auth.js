export const getAuthErrorMsg = error => {
    let msg = "";
    switch (error) {
        case "auth/already-initialized":
            msg = "Sy hižo přizjewjeny! Startuj aplikaciju znowa!";
            break;
        case "auth/credential-already-in-use":
            msg = "Twoje daty so hižo za druhi konto wužija!";
            break;
        case "auth/email-already-in-use":
            msg = "Twoja email so hižo za druhi konto wužija!";
            break;
        case "auth/internal-error":
            msg = "Zmylk wot serwera!";
            break;
        case "auth/invalid-user-token":
            msg = "Wužiwarja njedawa!";
            break;
        case "auth/invalid-email":
            msg = "Zapodata email njeeksistuje!";
            break;
        case "auth/wrong-password":
            msg = "Twoje zapodate daty su wopak!";
            break;
        case "auth/unverified-email":
            msg = "Twoja email njeje hišće werifikowana!";
            break;
        case "auth/user-not-found":
            msg = "Zapodateho wužiwarja njedawa!";
            break;
        case "auth/user-disabled":
            msg = "Zapodaty wužiwar nima přistup na kostrjanc!";
            break;
        case "auth/already-initialized":
            msg = "Aplikacija je hižo aktiwna. Startuj aplikaciju znowa!";
            break;
        case "auth/missing-email":
            msg = "Zapodaj jednu email!";
            break;
        default:
            msg = error;
            break;
    }
    return msg;
};
