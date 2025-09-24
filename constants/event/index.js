export const mapTypes = ["standard", "hybrid"];

/**
 *
 * @param {*} st Starting Time of Event in UTC+0
 * @param {*} end Ending Time of Event in UTC+0
 * @returns true if Date.now is between Starting and Ending Time of Event
 */
export function checkIfLive(st, end) {
    const date = Date.now();
    if (date >= st && date <= end) return true;
    else return false;
}

import { getAuth } from "firebase/auth";

/**
 *
 * @param {String[]} checkedList
 * @param {String} uid
 * @returns {boolean}
 */
export function checkIfClientIsInEvent(checkedList) {
    if (!checkedList) return false;
    return checkedList.includes(getAuth().currentUser.uid);
}

export function checkIfEventHasBanner(eventData) {
    return eventData.eventOptions.adBanner !== undefined;
}

export const Event_Types = [
    "event_types_0",
    "event_types_1",
    "event_types_2",
    "event_types_3",
    "event_types_4",
    "event_types_5",
    "event_types_6",
    "event_types_7",
    "event_types_8",
];

export const Event_Tags = [
    "event_tags_0",
    "event_tags_1",
    "event_tags_2",
    "event_tags_3",
    "event_tags_4",
    "event_tags_5",
    "event_tags_6",
    "event_tags_7",
    "event_tags_8",
    "event_tags_9",
    "event_tags_10",
    "event_tags_11",
    "event_tags_12",
    "event_tags_13",
    "event_tags_14",
    "event_tags_15",
    "event_tags_16",
    "event_tags_17",
    "event_tags_18",
    "event_tags_19",
    "event_tags_20",
    "event_tags_21",
    "event_tags_22",
    "event_tags_23",
    "event_tags_24",
    "event_tags_25",
    "event_tags_26",
    "event_tags_27",
    "event_tags_28",
    "event_tags_29",
    "event_tags_30",
    "event_tags_31",
    "event_tags_32",
    "event_tags_33",
    "event_tags_34",
    "event_tags_35",
    "event_tags_36",
    "event_tags_37",
    "event_tags_38",
    "event_tags_39",
    "event_tags_40",
    "event_tags_41",
    "event_tags_42",
    "event_tags_43",
];

export const initialRegion = {
    latitude: 51.186106956552244,
    longitude: 14.435684115023259,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export const mapStylesDefault3 = [
    {
        elementType: "geometry",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#9e9e9e",
            },
        ],
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#bdbdbd",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "poi.business",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
            {
                color: "#181818",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1b1b1b",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#2c2c2c",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#8a8a8a",
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                color: "#373737",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
            {
                color: "#3c3c3c",
            },
        ],
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
            {
                color: "#4e4e4e",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#000000",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#3d3d3d",
            },
        ],
    },
];

export const mapStylesDefault = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#060A0D" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#CCE6FF" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },

    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#e23b32" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#060A0D" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },

    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#CCE6FF" }],
    },

    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },

    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#5884B0" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#060A0D" }],
    },
];

export const mapStylesDefault2 = [
    {
        stylers: [
            {
                hue: "#5884B0",
            },
            {
                invert_lightness: false,
            },
            {
                saturation: -50,
            },
            {
                lightness: 25,
            },
            {
                gamma: 0.75,
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#143C63",
            },
        ],
    },
];
