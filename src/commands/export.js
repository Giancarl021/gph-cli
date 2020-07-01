const {
    question
} = require('readline-sync');
const {
    homedir
} = require('os');
const createHash = require('../util/hash');
const createJsonInterface = require('../util/json');
const createSecureJsonInterface = require('../util/sjson');
const {
    askUntil
} = require('../util/until');

module.exports = function (args, flags) {
    const [key, dest] = args;
    const credentials = flags.c || flags.credentials;
    const lock = flags.lock === undefined ? (credentials ? true : false) : flags.lock;
    if (!key) {
        throw new Error('No key provided');
    }
    if (!dest) {
        throw new Error('No destination provided');
    }

    const req = createJsonInterface(`data/requests/${key}`);

    if (!req.exists()) {
        throw new Error('This requests does not exists');
    }

    let json;

    if (lock || (credentials && lock)) {
        let password = flags.p || flags.password;
        if (!password) {
            password = createHash(askUntil(p => !!p, question, 'Insert a new password to the exported file: '));
        }
        json = createSecureJsonInterface(`${dest.replace('~', homedir())}/${key}.gphrc`, password);
    } else {
        json = createJsonInterface(`${dest.replace('~', homedir())}/${key}.gphr`, false);
    }

    const data = req.load();
    if (flags.c || flags.credentials) {
        const hash = createHash(data.credentials);
        const sjson = createSecureJsonInterface(`data/hash/${data.credentials}`, hash, true);
        if (!sjson.exists()) {
            throw new Error(`Credentials with key "${key}" does not exists`);
        }
        data.credentials = sjson.load();
    } else {
        delete data.credentials;
    }
    json.save(data);

    return 'Request exported in ' + json.path;
}