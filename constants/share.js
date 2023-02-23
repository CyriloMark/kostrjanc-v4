import { Alert, Platform, Share } from "react-native";

const staticShareURL = "https://www.kostrjanc.de/";

export async function share(type, id, title) {
    if (Platform.OS === "web") return;

    try {
        Share.share(
            {
                url: `${staticShareURL}${type === 0 ? "p" : "e"}/${id}`,
                title: title,
                message: `Dźělenje wot ${
                    type === 0 ? "posta" : "ewenta"
                } z titulom "${title}".\nStrona so wočini wy syći. Zo dóstanješ wšitke funkcije a lěpšu zwobrazliwosć instaluj sej kostrjanc App na twojim šmóratku!`,
            },
            {
                dialogTitle: title,
                subject: `Dźělenje wot ${
                    type === 0 ? "posta" : "ewenta"
                } z titulom "${title}"`,
            }
        );
    } catch (e) {
        Alert.alert(
            "Zmylk w dźělenju",
            `Dźělenje njebě wuspěšnje. Zmylk: ${error}`,
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
