import { Alert, Platform, Share } from "react-native";
import { getLangs } from "./langs";

const staticShareURL = "https://www.kostrjanc.de/pages/share.html";

export async function share(type, id, title) {
    if (Platform.OS === "web") return;

    try {
        Share.share(
            {
                url: `${staticShareURL}?t=${type === 0 ? "p" : "e"}?id=${id}`,
                title: title,
                message: `${getLangs("share_share_0")} ${
                    type === 0
                        ? getLangs("share_share_post")
                        : getLangs("share_share_event")
                } ${getLangs("share_share_1")} "${title}".\n${getLangs(
                    "share_share_2"
                )}`,
            },
            {
                dialogTitle: title,
                subject: `${getLangs("share_share_0")} ${
                    type === 0
                        ? getLangs("share_share_post")
                        : getLangs("share_share_event")
                } ${getLangs("share_share_1")} "${title}".`,
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
