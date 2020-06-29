const getGraphInstance = require('../services/graph');
const getCredentials = require('../util/credentials');
const {
    homedir
} = require('os');

module.exports = async function (args, flags) {
    const credentials = getCredentials(flags.c || flags.credentials);
    const graph = await getGraphInstance(credentials, flags.version || 'v1.0');

    const [url] = args;

    const response = await graph.list(url, {
        cache: {
            expiresIn: flags.cache || null
        },
        method: flags.method ? String(flags.method).toUpperCase() : 'GET',
        saveOn: flags.save ? flags.save.replace(/~/g, homedir()) : null,
        filter: typeof flags.filter === 'string' ? Function('return ' + flags.filter)() : null,
        map: typeof flags.map === 'string' ? Function('return ' + flags.map)() : null,
        reduce: typeof flags.filter === 'string' ? Function('return ' + flags.reduce)() : null,
        limit: flags.limit || null,
        offset: flags.offset || null
    });

    return flags.print === false ? '' : response;
}