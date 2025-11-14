import { Alert, Platform, Share } from "react-native";
import { getLangs } from "./langs";

const staticShareURL = "https://www.kostrjanc.de/pages/share.html";
// const staticShareURL = "https://www.kostrjanc.de/";

export async function share(type, id, title) {
    if (Platform.OS === "web") return;

    let body = {
        href: "",
        title: "",
        message: "",
    };

    switch (type) {
        case 0:
            body = {
                href: "p",
                title: `${getLangs("delete_post")}: ${title}`,
                message: `${getLangs("share_share_0")} ${getLangs(
                    "share_share_post"
                )} ${getLangs("share_share_pe1")} "${title}".\n\n${getLangs(
                    "share_share_hint"
                )}`,
            };
            break;
        case 1:
            body = {
                href: "e",
                title: `${getLangs("delete_event")}: ${title}`,
                message: `${getLangs("share_share_0")} ${getLangs(
                    "share_share_event"
                )} ${getLangs("share_share_pe1")} "${title}".\n\n${getLangs(
                    "share_share_hint"
                )}`,
            };
            break;
        case 2:
            body = {
                href: "u",
                title: `${getLangs("share_share_usertitle")}: ${title}`,
                message: `${getLangs("share_share_0")} ${getLangs(
                    "share_share_user"
                )} ${getLangs("share_share_u1")} "${title}".\n\n${getLangs(
                    "share_share_hint"
                )}`,
            };
            break;
    }

    try {
        Share.share(
            {
                url: `${staticShareURL}?t=${body.href}?id=${id}`,
                // url: `${staticShareURL}${type === 0 ? "p" : "e"}/${id}`,
                // url: `kostrjanc://${type === 0 ? "p" : "e"}/${id}`, ,
                title: body.title,
                message: body.message,
            },
            {
                dialogTitle: body.title,
                subject: body.title,
                tintColor: "#ffffff",
            }
        );
    } catch (e) {
        Alert.alert(
            getLangs("share_error_title"),
            `${getLangs("share_error_sub")} ${e}`,
            [
                {
                    text: "Ok",
                    style: "cancel",
                    isPreferred: true,
                },
            ]
        );
    }
}
