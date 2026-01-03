import {
    requestCalendarPermissionsAsync,
    createEventAsync,
    getCalendarsAsync,
    EntityTypes,
    getDefaultCalendarAsync,
    createEventInCalendarAsync,
} from "expo-calendar";
import { createShareURL } from "../share";

/**
 *
 * @returns {Promise<boolean>}
 */
async function initCalendar() {
    try {
        const { status } = await requestCalendarPermissionsAsync();
        if (status !== "granted") return false;
        return true;
    } catch (e) {
        console.log("error initCalendar()", e);
        return false;
    }
}

async function getClientDefaultCalendar() {
    const calendar = await getDefaultCalendarAsync();
    return calendar.id;
}

/**
 *
 * @param {Object} eventData
 * @param {number} eventData.id
 * @param {number} eventData.starting
 * @param {number} eventData.ending
 * @param {string} eventData.title
 * @param {string} eventData.description
 * @returns {Promise<boolean>}
 */
export async function createCalendarEntry(eventData) {
    try {
        const initStatus = await initCalendar();
        if (!initStatus) return false;

        await createEventInCalendarAsync(
            {
                title: eventData.title,
                originalId: eventData.id,
                creationDate: Date.now(),
                notes: eventData.description,
                startDate: new Date(eventData.starting),
                endDate: new Date(eventData.ending),
                url: createShareURL(1, eventData.id),
                location: `${eventData.geoCords.latitude}, ${eventData.geoCords.longitude}`,
            },
            {
                startNewActivityTask: false,
            }
        );

        return true;
    } catch (e) {
        console.log("error createCalendarEntry", e);
        return false;
    }
}
