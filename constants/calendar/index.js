export const DEFAULT_HEIGHT = Math.min(
    require("react-native").Dimensions.get("screen").height / 3,
    512
);
export const DEFAULT_DATEBOX_WIDTH = DEFAULT_HEIGHT * (1 / 8.875); //DEFAULT_HEIGHT * 8.875;
export const DEFAULT_MONTH_TO_SCROLL_COUNT = 5;

/**
 * Gibt das aktuelle Datum als Objekt zurück.
 * Enthält Jahr, Monat und Tag.
 *
 * Beispiel:
 *   getCurrentDate()
 *   // -> { year: 2025, month: 10, day: 2 }
 */
export function getCurrentDateInfo() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
    };
}

/**
 * Ermittelt den Wochentag für ein gegebenes Datum.
 *
 * @param {number} year - Das Jahr (z. B. 2025)
 * @param {number} month - Der Monat (0–11, z. B. 9 für Oktober)
 * @param {number} day - Der Tag im Monat (1–31)
 * @returns {string} - Der Wochentag als Zahl (z. B. "3 = Donnerstag")
 */
function getWeekday(year, month, day) {
    // Achtung: Beim Date-Konstruktor ist der Monat 0-basiert (0 = Januar, 11 = Dezember).
    const date = new Date(year, month, day);

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    // getDay() liefert eine Zahl zwischen 0 und 6 zurück
    return mod(date.getDay() - 1, 7);
}

/**
 * Gibt die Anzahl der Tage im angegebenen Monat zurück.
 *
 * @param {number} year - Jahr (z. B. 2025)
 * @param {number} month - Monat (1–12)
 * @returns {number} - Anzahl der Tage im Monat
 */
export function getDaysInMonth(year, month) {
    // Date(year, month, 0) gibt den letzten Tag des angegebenen Monats zurück,
    // weil month hier 1-basiert ist und "Tag 0" den letzten Tag des Vormonats bedeutet.
    return new Date(year, month, 0).getDate();
}

export function generateMonthDatas(amt) {
    const today = getCurrentDateInfo();

    let out = [
        {
            ...today,
            weekday: getWeekday(today.year, today.month, 1),
        },
    ];
    for (let i = 1; i < amt; i++) {
        const m = (today.month + i) % 12;
        const y = today.year + Math.floor((today.month + i) / 12);
        out.push({
            day: 1,
            month: m,
            year: y,
            weekday: getWeekday(y, m, 1),
        });
    }

    return out;
}

/**
 * Builds a calendar structure for a given month.
 * Returns an array of weeks (rows), each week is an array of 7 cells.
 * Each cell contains:
 *   - date: day number (1–dayCount) or 0 for empty cells
 *   - type: placeholder for additional info (e.g., holidays, events)
 *
 * @param {Object} month - Month object
 * @param {number} month.year - Year, e.g., 2025
 * @param {number} month.month - 0-based month (0 = January)
 * @param {number} month.weekday - Weekday of the 1st day of the month (Monday = 0, Sunday = 6)
 * @param {Object} colors - Colors object
 * @param {number[]} colors.selected - Selected (blue highlighted) dates
 * @param {number[]} colors.checked - Checked (red highlighted) dates
 * @returns {Array<Array<{date:number,type:number}>>} Calendar structure
 */
export function buildMonthStructure(month, colors) {
    // Total number of days in the month
    const dayCount = getDaysInMonth(month.year, month.month + 1);

    // Total number of cells: all days plus the leading empty cells before the month starts
    const totalCells = dayCount + month.weekday;

    // Number of calendar rows (weeks) needed
    const rows = Math.ceil(totalCells / 7);

    // Build the calendar structure using Array.from for clarity
    return Array.from({ length: rows }, (_, rowIndex) => {
        return Array.from({ length: 7 }, (_, colIndex) => {
            // Compute the calendar cell index
            const cellIndex = rowIndex * 7 + colIndex;

            // Calculate the actual date number; negative or 0 means empty cell
            const date = cellIndex - month.weekday + 1;

            let type = 0;
            if (colors.checked.includes(date)) type = 2;
            else if (colors.selected.includes(date)) type = 1;

            return {
                date: date > 0 && date <= dayCount ? date : null, // 0 = empty cell
                type: type,
            };
        });
    });
}
