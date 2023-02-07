import { Alert } from "react-native";
import { openURL } from "expo-linking";

export function openLink(link) {
    Alert.alert(
        "Link wočinić?",
        "Chceš so na eksternu stronu dale wodźić dać?",
        [
            {
                text: "Ně",
                style: "destructive",
            },
            {
                text: "Haj",
                style: "default",
                onPress: () => {
                    openURL(link);
                },
            },
        ]
    );
}

export function arraySplitter(data, coloums) {
    let splitter =
        Math.floor(data.length / coloums) +
        (data.length % coloums === 0 ? 0 : 1);
    let newData = [];

    for (let i = 0; i < splitter; i++) {
        let currentObject = [];
        for (let j = i * coloums; j < coloums + i * coloums; j++) {
            if (j < data.length) currentObject.push(data[j]);
        }
        newData.push(currentObject);
    }
    return newData;
}

export function sortArrayByDate(data) {
    let dates = data;
    for (let i = data.length - 1; i >= 0; i--) {
        for (let j = 1; j <= i; j++) {
            if (dates[j - 1].created > dates[j].created) {
                let temp = dates[j - 1];
                dates[j - 1] = dates[j];
                dates[j] = temp;
            }
        }
    }
    return dates;
}

export function lerp(min, max, ratio) {
    return min * (1 - ratio) + max * ratio;
}
