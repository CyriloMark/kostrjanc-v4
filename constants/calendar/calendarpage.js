import { child, get, getDatabase, ref } from "firebase/database";

export async function getEvents() {
    try {
        const db = getDatabase();
        const events = Object.values(
            (await get(child(ref(db), "events"))).val(),
        );

        if (!events) return [];

        let out = [];
        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            if (e.isBanned || e.group) continue;
            // if (events[i].ending < Date.now()) continue;

            out.push(events[i]);
        }

        return out;
    } catch (e) {
        console.log("error calendarpage.js getEvents", e);
        return [];
    }
}
