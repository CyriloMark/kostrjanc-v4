import { Alert } from "react-native";

import { getLangs } from "../langs";
import { removeAllContentData } from "../storage/content";

//#region helpLinks
export const helpLinks = [
    {
        title: "help_links_0",
        link: "https://kostrjanc.de",
    },
    {
        title: "help_links_1",
        link: "https://kostrjanc.de/pomoc/",
    },
    {
        title: "help_links_2",
        link: "https://kostrjanc.de/pomoc/formular#bugs",
    },
    {
        title: "help_links_3",
        link: "https://kostrjanc.de/business",
    },
    {
        title: "help_links_4",
        link: "https://dashboard.kostrjanc.de/",
    },
];

//#region verifyCriterias LangKeys
export const verifyCriterias = [
    "verify_criterias_0",
    "verify_criterias_1",
    "verify_criterias_2",
    "verify_criterias_3",
    "verify_criterias_4",
];

//#region handleRemoveCache()
export function handleRemoveCache() {
    Alert.alert(
        getLangs("settings_removecache_title"),
        getLangs("settings_removecache_sub"),
        [
            {
                text: getLangs("no"),
                style: "destructive",
            },
            {
                text: getLangs("yes"),
                style: "default",
                onPress: async () => {
                    const rsp = await removeAllContentData();

                    // Successful case
                    if (rsp) {
                        Alert.alert(
                            getLangs("settings_removecache_success_title"),
                            getLangs("settings_removecache_success_sub"),
                            [
                                {
                                    text: "Ok",
                                    style: "default",
                                },
                            ]
                        );
                    } else {
                        Alert.alert(
                            getLangs("settings_removecache_error_title"),
                            getLangs("settings_removecache_error_sub"),
                            [
                                {
                                    text: "Ok",
                                    style: "default",
                                },
                            ]
                        );
                    }
                },
            },
        ]
    );
}
