export const User_Placeholder = {
    name: "",
    description: "",
    follower: [],
    following: [],
    posts: [],
    events: [],
    isAdmin: false,
    isMod: false,
    isBanned: false,
    pbUri: "https://www.colorhexa.com/587db0.png",
};

export const Post_Placeholder = {
    id: "",
    type: 0,
    title: "",
    description: "",
    creator: "",
    created: 0,
    comments: [],
    imgUri: "https://www.colorhexa.com/587db0.png",
    isBanned: false,
};

export const Event_Placeholder = {
    id: "",
    type: 1,
    title: "",
    description: "",
    starting: 0,
    ending: 0,
    geoCords: {
        latitude: 67,
        latitudeDelta: 50.7,
        longitude: 0.094,
        longitudeDelta: 117,
    },
    creator: "",
    created: 0,
    comments: [],
    checks: [],
    isBanned: false,
    eventOptions: {},
};

export const Banner_Placeholder = {
    id: 0,
    title: "",
    description: "",
    starting: 0,
    ending: 0,
};

export const Comment_Placeholder = {
    content: "",
    created: 0,
    creator: "",
};

export const Report_Placeholder = {
    id: 0,
    item: {},
    creator: "",
    description: "",
    type: -1,
};

export const Ban_Placeholder = {
    id: 0,
    item: {},
    creator: "",
    description: "",
};
