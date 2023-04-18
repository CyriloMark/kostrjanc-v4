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
        0
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
