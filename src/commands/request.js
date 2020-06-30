const {
    question,
    keyInSelect,
    keyInYN
} = require('readline-sync');
const createJsonInterface = require('../util/json');
const askOptions = require('../util/options');

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
        const types = ['unit', 'list', 'massive'];

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

        console.log(request);
        process.exit(0);

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

        return data;
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

        json.remove();

        return `Request "${key}" removed`;
    },

    list() {
        return keys.get();
    },

    import() {

    },

    export () {

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