import { getLangs } from "../langs";

export const General_Group = {
    id: 0,
    name: getLangs("groups_general_title"),
    description: getLangs("groups_general_description"),
    members: [-1],
    posts: [],
    events: [],
    imgUri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/groups%2Fgroup_img_general.jpg?alt=media&token=5d899136-9e83-4c49-b8f3-0466df23b0be",
    isDefaultGroup: true,
};

export const ForYou_Group = {
    id: 1,
    name: getLangs("groups_foryou_title"),
    description: getLangs("groups_foryou_description"),
    members: [-1],
    posts: [],
    events: [],
    imgUri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/groups%2Fgroup_img_random%20.jpg?alt=media&token=09570104-0fe5-41df-b6aa-272fca3d61d3",
    isDefaultGroup: true,
};

export const Challenge_Group = {
    id: 2,
    name: getLangs("groups_challenge_title"),
    description: getLangs("groups_challenge_description"),
    members: [-1],
    posts: [],
    events: [],
    imgUri: "https://firebasestorage.googleapis.com/v0/b/kostrjanc.appspot.com/o/groups%2Fgroup_img_challenge.png?alt=media&token=d2be8980-8eb5-4fad-99f0-d5066af79db6",
    isDefaultGroup: true,
};
