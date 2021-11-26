module.exports.getNowDate = () => {
    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDay();

    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초

    return (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
}