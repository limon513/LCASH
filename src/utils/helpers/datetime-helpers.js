function compareTime(timeString1) {
    let date1 = new Date(timeString1);
    let date2 = Date.now();
    const differenceInMilliseconds = Math.abs(date2 - date1);
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    return differenceInMinutes < 5;
}

module.exports = {
    compareTime
}