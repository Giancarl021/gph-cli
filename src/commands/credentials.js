const {
    question
} = require('readline-sync');
const result = require('../util/result');
const capitalize = require('../util/capitalize');
const createHash = require('../util/hash');
const createSecureJsonInterface = require('../util/sjson');

const operations = {
    add(args, flags) {
        const [key] = args;

        if(!key) {
            throw new Error('No key provided');
        }

        const credentials = {
            tenant_id: String(flags['tenant-id']) || String(flags['t']) || null,
            client_id: String(flags['client-id']) || String(flags['c']) || null,
            client_secret: String(flags['client-secret']) || String(flags['s']) || null
        };

        for(const key in credentials) {
            let first = true;
            while(!credentials[key]) {
                if(!first) console.log('Invalid input!');
                credentials[key] = question(`Insert the ${key.split('_').map(capitalize).join(' ')}: `);
                first = false;
            }
        }

        const hash = createHash(credentials.tenant_id + credentials.client_id + credentials.client_secret);
        const sjson = createSecureJsonInterface(`data/hash/${key}`, hash, true);

        sjson.save(credentials);

        return 'Credentials created';
    },

    get(args, flags) {
        
    },

    edit(args, flags) {

    },

    remove(args, flags) {

    },

    save(args, flags) {

    }
};

module.exports = function (args, flags) {
    const index = args.shift();
    const operation = operations[index];
    if (!operation) {
        return result(`Operation "${operation || ''}" does not exists`);
    }
    return result(operation(args, flags));
}