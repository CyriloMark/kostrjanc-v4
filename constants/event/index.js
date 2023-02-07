export const mapTypes = ["standard", "hybrid"];

export function checkIfLive(st, end) {
    const date = Date.now();
    if (date >= st && date <= end) return true;
    else return false;
}

export const Event_Types = [
    "wiki/wustajenca",
    "schadźow./zhromadź.",
    "jubilej/swjedźeń",
    "teamowy/załožbowy ewent",
    "seminar/webinar/workshop",
    "party/barcamp",
    "festiwal",
    "cyrkwinski swjedźeń",
    "druhi",
];

export const Event_Tags = [
    "p16",
    "p18",
    "'muttizettel'",
    "narodniny",
    "darmotny zastup",
    "zymne piwo",
    "shisha",
    "mjezynarodne",
    "Kóždy je witany!",
    "dźěło",
    "kwas",
    "dj",
    "catering",
    "Buisness",
    "wjesny klub",
    "alkohol",
    "njealkoholiske",
    "toćene piwo",
    "slěbory kwas",
    "złoty kwas",
    "18",
    "20",
    "30",
    "33",
    "40",
    "50",
    "60",
    "100",
    "přiroda",
    "zwěrjo",
    "live hudźba",
    "priwatne",
    "Jenož z přeprošenjom",
    "zhormadnosć",
    "wiki",
    "hody",
    "jutry",
];
