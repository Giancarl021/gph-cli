const createFileHandler = require('./file');

module.exports = function (path) {
    const file = createFileHandler(path);

    function get() {
        return getArray().join('\n');
    }

    function add(key) {
        const arr = getArray();
        arr.push(key);
        setArray(arr);
    }

    function remove(key) {
        const arr = getArray();
        const index = arr.findIndex(e => e === key);
        if(index === -1) return;
        arr.splice(index, 1);
        setArray(arr);
    }

    function getArray() {
        if(!file.exists()) return [];
        const str = file.load();
        return str.split('\n');
    }

    function setArray(arr) {
        file.save([...new Set(arr.filter(e => e))].join('\n'));
    }

    return {
        add,
        get,
        remove
    };
}