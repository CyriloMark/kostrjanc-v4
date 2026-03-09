export const convertTimestampToString = id => {
    const date = new Date(id);
    return (
        date.getDate() +
        "." +
        (date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        ", " +
        date.getHours() +
        ":" +
        (date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes()
            : date.getMinutes())
    );
};

export const convertTextIntoTimestamp = val => {
    // "10.12.2022 19:25"
    // "December 10, 1815 19:25"

    const splitRegex = /\D/;
    let dateSplit = val.split(splitRegex);

    if (dateSplit.length != 5) return null;

    const getYear = () => {
        let out = "";
        switch (dateSplit[2].length) {
            case 1:
                out = `200${dateSplit[2]}`;
                break;
            case 2:
                out = `20${dateSplit[2]}`;
                break;
            case 3:
                out = `2${dateSplit[2]}`;
                break;
            case 4:
                out = dateSplit[2];
                break;
            default:
                break;
        }
        return out;
    };

    const year = getYear();

    const dateFormat = new Date(
        year,
        dateSplit[1] - 1,
        dateSplit[0],
        dateSplit[3],
        dateSplit[4],
        0,
        0,
    );
    const a = Date.parse(dateFormat);
    return a;
};

export const convertTimestampToDate = id => {
    const date = new Date(id);
    return (
        date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear()
    );
};
export const convertTimestampToTime = id => {
    const date = new Date(id);
    return (
        date.getHours() +
        ":" +
        (date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes()
            : date.getMinutes())
    );
};

import { getLangs } from "./langs";

//#region getWeekday()
/**
 * Ermittelt den Wochentag für ein gegebenes Datum.
 *
 * @param {number} year - Das Jahr (z. B. 2025)
 * @param {number} month - Der Monat (0–11, z. B. 9 für Oktober)
 * @param {number} day - Der Tag im Monat (1–31)
 * @returns {string} - Der Wochentag als Zahl (z. B. "3 = Donnerstag")
 */
export function getWeekday(year, month, day) {
    // Achtung: Beim Date-Konstruktor ist der Monat 0-basiert (0 = Januar, 11 = Dezember).
    const date = new Date(year, month, day);

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    // getDay() liefert eine Zahl zwischen 0 und 6 zurück
    return mod(date.getDay() - 1, 7);
}

/**
 * Converts a time number into a string, i.E.: `Štórtk, 3. decembra 2025`
 * @param {number} time Time to convert
 * @returns {String}
 */
export function convertTimestampToDateText(time) {
    const date = new Date(time);

    const weekday = getWeekday(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    );
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hours = date.getHours();
    const mins = date.getMinutes();

    let timeOut =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (mins < 10 ? "0" + mins : mins);

    let out = "";

    out += getLangs(`publishdate_weekday_${weekday}`) + ", ";
    out +=
        day +
        ". " +
        getLangs(`publishdate_month_2_${month}`) +
        " " +
        year +
        " • " +
        timeOut +
        " " +
        getLangs("publishdate_time");

    return out;
}
