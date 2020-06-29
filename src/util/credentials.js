const createFileInterface = require('./file');
const createSecureJsonInterface = require('./sjson');
const createHash = require('./hash');

module.exports = function (key = 'default') {
    const file = createFileInterface('data/hash/default');
    let _key = key;

    if(key === 'default' || !key || typeof key !== 'string') {
        if(!file.exists()) {
            throw new Error('Default credentials not set');
        }
        _key = file.load();
    }

    const hash = createHash(_key);
    const sjson = createSecureJsonInterface(`data/hash/${_key}`, hash, true);

    return sjson.load();
}