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

const credentialsCommand = require('./credentials');


module.exports = function (args, flags) {
    const [dest] = args;
    if (!dest) {
        throw new Error('No destination provided');
    }

    const name = args[1] || dest.split('/').pop().replace(/\.(gphr|gphrc)$/, '');

    let json;

    if (!/\.(gphr|gphrc)$/.test(dest)) {
        throw new Error('Invalid input path');
    }

    if (/\.gphrc$/.test(dest)) {
        let password = flags.p || flags.password;
        if (!password) {
            password = createHash(askUntil(p => !!p, question, 'Insert the file password to import the request: '));
        }
        json = createSecureJsonInterface(dest.replace('~', homedir()), password);
    } else {
        json = createJsonInterface(dest.replace('~', homedir()), false);
    }

    const data = json.load();

    if (data.credentials) {
        const credentials = {
            'tenant-id': data.credentials.tenant_id,
            'client-id': data.credentials.client_id,
            'client-secret': data.credentials.client_secret,
        };
        try {
            credentialsCommand(['set', `req@${name}`], {
                ...credentials,
                force: true
            }, true);
        } catch (err) {
            throw new Error('Creation of credentials: ' + err.message);
        }

        data.credentials = `req@${name}`;
    }

    const req = createJsonInterface(`data/requests/${name}`);

    req.save(data);

    return `Request "${name}" successfully imported`;
}