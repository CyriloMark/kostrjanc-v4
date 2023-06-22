export const TUTORIAL_DATA = [
    {
        id: 0,
        title_id: "tutorial_mainnav",
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/tutorial_vids%2Fkostrjanc%20Tutorial%2001%20-%20H%C5%82owna%20nawigacija%20a%20startowa%20strona.mp4?alt=media&token=081d732c-9f0d-4e03-b756-630affc27264",
    },
    {
        id: 1,
        title_id: "tutorial_contentpage",
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/tutorial_vids%2Fkostrjanc%20Tutorial%2002%20-%20%C5%A0to%20je%20kostrjanc%20STUDIJO.mp4?alt=media&token=106c9f73-e27a-4a48-8f58-60a94c3a55ba",
    },
    {
        id: 2,
        title_id: "tutorial_profile",
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/tutorial_vids%2Fkostrjanc%20Tutorial%2003%20-%20Tw%C3%B3j%20profil.mp4?alt=media&token=22aee957-3b4b-437a-9fd1-4dcdbac5fcb2",
    },
    {
        id: 3,
        title_id: "tutorial_post",
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/tutorial_vids%2Fkostrjanc%20Tutorial%2004%20-%20%C5%A0to%20su%20Posty.mp4?alt=media&token=ec384e45-76ed-4a06-a84c-4d26f2de6993",
    },
    {
        id: 4,
        title_id: "tutorial_event",
        uri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/tutorial_vids%2Fkostrjanc%20Tutorial%2005%20-%20%C5%A0to%20su%20Ewenty.mp4?alt=media&token=e884d691-0dcf-4652-aade-b59635fb8ba7",
    },
];

import { getData, hasData, storeData } from "../storage";

/*
    Output tutorialUserData:
    [
        bool? seen,
        bool? seen,
        ...
    ]
*/

export const checkIfTutorialNeeded = async id => {
    if (!(await hasData("tutorials"))) return true;
    const tutorialUserData = await getData("tutorials");
    if (tutorialUserData[id]) return false;
    return true;
};

export const setTutorialAsSeen = async id => {
    let tutorialUserData = [false, false, false, false, false];

    if (!(await hasData("tutorials"))) {
        tutorialUserData[id] = true;
        await storeData("tutorials", tutorialUserData);
        return;
    }

    tutorialUserData = await getData("tutorials");
    tutorialUserData[id] = true;
    await storeData("tutorials", tutorialUserData);
    return;
};

export const resetTutorials = async () => {
    await storeData("tutorials", [false, false, false, false, false]);
    return;
};
