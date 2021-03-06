const { question, keyInYN } = require('readline-sync');
const capitalize = require('../util/capitalize');
const createHash = require('../util/hash');
const createFileInterface = require('../util/file');
const createSecureJsonInterface = require('../util/sjson');
const createKeysInterface = require('../util/keys');

const keys = createKeysInterface('data/hash/keys');

let innerCall;

const operations = {
    set(args, flags) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }

        if (key.includes('/') || (!innerCall && (key.includes('@')))) {
            throw new Error('Invalid key name');
        }

        const hash = createHash(key);
        const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

        if (sjson.exists() && !(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
            const abort = !keyInYN('This key already exists, do you want to overwrite? ');
            if (abort) return 'Aborted by user';
        }

        const credentials = {
            tenant_id: flags['tenant-id'] || flags['t'] || null,
            client_id: flags['client-id'] || flags['c'] || null,
            client_secret: flags['client-secret'] || flags['s'] || null
        };

        for (const key in credentials) {
            let first = true;
            while (!credentials[key]) {
                if (!first) console.log('Invalid input!');
                credentials[key] = question(`Insert the ${key.split('_').map(capitalize).join(' ')}: `);
                first = false;
            }
            credentials[key] = String(credentials[key]);
        }

        if(!flags.hasOwnProperty('delegated') && !flags.hasOwnProperty('d')) {
            credentials.delegated = keyInYN('This credentials are for delegated access?');
        } else if(flags.delegated === false || flags.d === false) {
            credentials.delegated = false;
        } else {
            credentials.delegated = true;
        }

        sjson.save(credentials);
        keys.add(key);
        return 'Credentials created';
    },

    get(args) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }

        const hash = createHash(key);
        const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

        if (!sjson.exists()) {
            return 'Credentials with this key does not exists';
        }

        const data = sjson.load();

        return `Tenant ID: ${data.tenant_id}\n` +
            `Client ID: ${data.client_id}\n` +
            `Client Secret: ${data.client_secret}\n` + 
            `Credentials type: ${data.delegated ? 'Delegated': 'Application'}`;
    },

    default (args, flags) {
        const file = createFileInterface('data/hash/default');

        const operations = {
            set(args) {
                const [key] = args;

                if (!key) {
                    throw new Error('No key provided');
                }

                const hash = createHash(key);
                const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

                if (!sjson.exists()) {
                    return 'Credentials with this key does not exists';
                }

                file.save(key);

                return `Saved "${key}" as default credentials`;
            },

            get() {
                if (!file.exists()) {
                    return 'No default credentials is set';
                }

                return file.load();
            },

            remove(_, flags) {
                if (!file.exists()) {
                    return 'No default credentials is set';
                }
                if (!(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
                    const abort = !keyInYN('Are you sure you want to remove the default credentials? ');
                    if (abort) return 'Aborted by user';
                }

                file.remove();

                return 'Default credentials removed';
            }
        };
        const index = args.shift();

        const operation = operations[index];
        if (!operation) {
            return `Operation "${index || ''}" does not exists in default subcommand`;
        }

        return operation(args, flags);
    },

    remove(args, flags) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }
        const hash = createHash(key);
        const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

        if (!sjson.exists()) {
            return 'Credentials with this key does not exists';
        }

        if (!(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
            const abort = !keyInYN(`Are you sure you want to remove the credentials "${key}"? `);
            if (abort) return 'Aborted by user';
        }

        sjson.remove();
        keys.remove(key);

        const defaultFile = createFileInterface('data/hash/default');

        if (defaultFile.exists()) {
            const d = defaultFile.load();
            if (d === key) {
                defaultFile.remove();
            }
        }

        return `Credentials "${key}" removed`;
    },

    list() {
        return keys.get();
    }
};

module.exports = function (args, flags, _innerCall = false) {
    innerCall = _innerCall;
    const index = args.shift();
    const operation = operations[index];
    if (!operation) {
        return `Operation "${index || ''}" does not exists`;
    }
    return operation(args, flags);
}