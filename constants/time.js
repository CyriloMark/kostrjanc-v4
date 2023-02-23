export const convertTimestampToString = id => {
    const date = new Date(id);
    return (
        date.getDate() +
        "." +
        (date.getMonth() + 1) +
        "." +
        date.getFullYear() +
        " " +
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

    const dateFormat = new Date(
        dateSplit[2],
        dateSplit[1] - 1,
        dateSplit[0],
        dateSplit[3],
        dateSplit[4],
        0,
        0
    );
    const a = Date.parse(dateFormat);
    return a;
};
