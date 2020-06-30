const {
    question,
    keyInSelect,
    keyInYN
} = require('readline-sync');
const {
    homedir
} = require('os');
const createHash = require('../util/hash');
const createJsonInterface = require('../util/json');
const createSecureJsonInterface = require('../util/sjson');
const createDirectoryInterface = require('../util/directory');
const askOptions = require('../util/options');
const {
    askUntil
} = require('../util/until');

const credentialsCommand = require('./credentials');
const reqCommand = {
    token: require('./token'),
    unit: require('./unit'),
    list: require('./list'),
    massive: require('./massive')
};

const operations = {
    set(args, flags) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }

        const json = createJsonInterface(`data/requests/${key}`);

        if (json.exists() && !(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
            const abort = !keyInYN('This request already exists, do you want to overwrite? ');
            if (abort) return 'Aborted by user';
        }

        const request = {};

        let index, first;
        const types = ['unit', 'list', 'massive', 'token'];

        index = keyInSelect(types, 'What type of request?');
        if (index === -1) {
            return 'Aborted by user';
        }
        request.type = types[index];
        first = true;
        do {
            if (!first) console.log('Invalid input!');
            request.url = question(`What is the URL${request.type === 'massive' ? ' Pattern' : ''}? `);
            first = false;
        } while (!request.url);

        askOptions(request);

        request.credentials = question('What are the default credentials to this request? ');

        json.save(request);
        return 'Request created';
    },

    get(args) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }

        const json = createJsonInterface(`data/requests/${key}`);

        if (!json.exists()) {
            return 'This request does not exists';
        }

        const data = json.load();

        return `--{ ${key} }--\n` +
            `URL${data.type === 'massive' ? ' Pattern' : ''}: ${data.url}\n` +
            `Type: ${data.type}\n` +
            `Credentials Used: ${data.credentials || 'None'}` +
            (Object.keys(data.options).length ? `\nOptions:\n${printObj(data.options, 1)}` : '');

        function printObj(o, deep = 0, _r = '') {
            let r = _r;
            const i = new Array(deep * 4).join(' ');
            for (const key in o) {
                if (typeof o[key] === 'object') {
                    r += `${i}${key}:\n${printObj(o[key], deep + 1, r)}`;
                } else {
                    r += `${i}${key}: ${o[key]}\n`;
                }
            }

            return r;
        }
    },

    remove(args, flags) {
        const [key] = args;

        if (!key) {
            throw new Error('No key provided');
        }

        const json = createJsonInterface(`data/requests/${key}`);

        if (!json.exists()) {
            return 'This request does not exists';
        }

        if (!(flags.hasOwnProperty('f') || flags.hasOwnProperty('force'))) {
            const abort = !keyInYN(`Are you sure you want to remove the request "${key}"? `);
            if (abort) return 'Aborted by user';
        }

        const data = json.load();

        if (data.credentials.includes('@')) {
            try {
                credentialsCommand(['remove', `req@${key}`], {
                    f: true
                }, true);
            } catch (err) {
                throw new Error('Credentials deletion: ' + err.message);
            }
        }

        json.remove();

        return `Request "${key}" removed`;
    },

    list() {
        const dir = createDirectoryInterface('data/requests');
        return dir.files()
            .map(request => request.replace(/\.json$/, ''))
            .join('\n');
    },

    import(args, flags) {
        const [dest] = args;
        const name = args[1] || dest.split('/').pop().replace(/\.(gphr|gphrc)$/, '');
        if (!dest) {
            throw new Error('No destination provided');
        }

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
    },

    export (args, flags) {
        const [key, dest] = args;
        const credentials = flags.c || flags.credentials;
        const lock = (flags.l || flags.lock) === undefined ? (credentials ? true : false) : (flags.l || flags.lock);
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
    },

    async exec(args, flags) {
        const [key] = args;
        if (!key) {
            throw new Error('No key provided');
        }

        const json = createJsonInterface(`data/requests/${key}`);
        if (!json.exists()) {
            throw new Error('This request does not exists');
        }

        const {
            type,
            options,
            url,
            credentials
        } = json.load();

        const cmd = [url];
        if(type === 'massive') {
            cmd.push(options.values);
            delete options.values;
        }
        
        const _flags = {
            ...options,
            credentials,
            ...flags
        };

        console.log(cmd, _flags);

        return await reqCommand[type](cmd, _flags);
    }
};

module.exports = async function (args, flags) {
    const index = args.shift();
    const operation = operations[index];
    if (!operation) {
        return `Operation "${index || ''}" does not exists`;
    }
    return await operation(args, flags);
}