const {
    question,
    keyInYN
} = require('readline-sync');
const capitalize = require('../util/capitalize');
const createHash = require('../util/hash');
const createFileInterface = require('../util/file');
const createSecureJsonInterface = require('../util/sjson');

const operations = {
    set(args, flags) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
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

        sjson.save(credentials);

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

        return '\n' +
            `Tenant ID: ${data.tenant_id}\n` +
            `Client ID: ${data.client_id}\n` +
            `Client Secret: ${data.client_secret}`;
    },

    default (args, flags) {
        const file = createFileInterface('data/hash/default');

        const operations = {
            set(args, flags) {
                const [key] = args;

                if (!key) {
                    throw new Error('No key provided');
                }

                const hash = createHash(key);
                const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

                if (!sjson.exists()) {
                    return 'Credentials with this key does not exists';
                }

                if (file.exists() && !(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
                    const abort = !keyInYN('The default credentials is already set, do you want to overwrite? ');
                    if (abort) return 'Aborted by user';
                }

                file.save(key);

                return `Saved "${key}" as default credentials`;
            },

            get() {
                if(!file.exists()) {
                    return 'No default credentials is set';
                }

                return file.load();
            },

            remove(_, flags) {
                if(!file.exists()) {
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
    }
};

module.exports = function (args, flags) {
    const index = args.shift();
    const operation = operations[index];
    if (!operation) {
        return `Operation "${index || ''}" does not exists`;
    }
    return operation(args, flags);
}