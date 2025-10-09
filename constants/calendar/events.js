import { getAuth } from "firebase/auth";
import { get, ref, child, getDatabase } from "firebase/database";
import { getDaysInMonth } from ".";

async function getFutureEvents() {
    try {
        const eventSnap = await get(child(ref(getDatabase()), "events"));
        if (!eventSnap.exists()) return [];

        return Object.values(eventSnap.val());
    } catch (error) {
        console.log("error in constants/calendar/events.js", error);
        return [];
    }
}

export async function getFutureEventsByMonth() {
    const events = await getFutureEvents();

    const today = new Date();
    let out = [];

    events.forEach(event => {
        if (event.isBanned) return;
        const start = new Date(event.starting);
        const end = new Date(event.ending);

        if (start.getMonth() >= today.getMonth()) {
            const s = start.getFullYear() * 12 + start.getMonth();
            const e = end.getFullYear() * 12 + end.getMonth();
            const range = e - s;

            for (let i = 0; i <= range; i++) {
                out.push({
                    month: (start.getMonth() + i) % 12,
                    year:
                        start.getFullYear() +
                        Math.floor((start.getMonth() + i) / 12),
                    data: event,
                });
            }
        }
    });

    return out;
}

/**
 *
 * @param {Object[]} relevantEvents
 */
export function translateRelevantEventsToColor(relevantEvents) {
    let selected = [];
    let checked = [];

    relevantEvents.forEach(event => {
        const start = new Date(event.data.starting);
        const end = new Date(event.data.ending);

        const totalMonthDiff =
            end.getFullYear() * 12 +
            end.getMonth() -
            (start.getFullYear() * 12 + start.getMonth());

        const currentMonthDiffFromStart =
            event.month +
            event.year * 12 -
            (start.getMonth() + start.getFullYear() * 12);

        if (currentMonthDiffFromStart === 0) {
            // First days
            let range =
                (totalMonthDiff === 0 ? end.getDate() : 31) - start.getDate();

            for (let i = 0; i <= range; i++) {
                selected.push(start.getDate() + i);
                if (event.data.checks?.includes(getAuth().currentUser.uid))
                    checked.push(start.getDate() + i);
            }
        } else if (currentMonthDiffFromStart === totalMonthDiff) {
            // Last Days
            for (let i = 0; i <= end.getDate(); i++) {
                selected.push(i);
                if (event.data.checks?.includes(getAuth().currentUser.uid))
                    checked.push(i);
            }
        } else {
            // Middle Days
            selected.push(...Array.from({ length: 31 }, (_, i) => i + 1));
            if (event.data.checks?.includes(getAuth().currentUser.uid))
                checked.push(...Array.from({ length: 31 }, (_, i) => i + 1));
        }
    });

    return { selected: selected, checked: checked };
}
