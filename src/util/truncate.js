module.exports = function (data, flag) {
    const str = typeof data === 'object' ? JSON.stringify(data, null, 4) : data.toString();

    if(!flag) return str;
    const length = typeof flag === 'number' ? flag : 2000;

    return str.substring(0, length);
}