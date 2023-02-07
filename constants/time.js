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
