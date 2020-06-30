const createJsonInterface = require('../util/json');

const reqCommand = {
    token: require('./token'),
    unit: require('./unit'),
    list: require('./list'),
    massive: require('./massive')
};

module.exports = async function (args, flags) {
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
    if (type === 'massive') {
        cmd.push(options.values);
        delete options.values;
    }

    const _flags = {
        ...options,
        credentials,
        ...flags
    };

    return await reqCommand[type](cmd, _flags);
}