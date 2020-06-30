const getGraphInstance = require('../services/graph');
const getCredentials = require('../util/credentials');
const {
    homedir
} = require('os');

module.exports = async function (args, flags) {
    const credentials = getCredentials(flags.c || flags.credentials);
    const graph = await getGraphInstance(credentials, flags.version || 'v1.0');

    const [urlPattern, _values] = args;

    if (!urlPattern) {
        throw new Error('URL Pattern must be an string');
    }

    if (!_values) {
        throw new Error('Values must be an string');
    }

    if(!flags.type) {
        throw new Error('Flag "--type" is required');
    }

    if(!flags.binder) {
        throw new Error('Flag "--binder" is required');
    }

    const matches = [...urlPattern.matchAll(/{[^{}]*?}/g)].map(e => e[0].replace(/({|})*/g, ''));

    const values = {};
    String(_values)
        .split(';')
        .forEach(e => {
            const [key, value] = e.trim().split(':');
            if (!value) {
                if (matches.length === 1 && key) {
                    return values[matches[0]] = key.split(',').map(e => e.trim());
                } else {
                    throw new Error('Values shorthand only possible when you have only one variable on the URL Pattern');
                }
            }
            values[key] = value.split(',').map(e => e.trim());
        });

    if(!Object.keys(values).length) {
        throw new Error('Invalid values parameter');
    }


    const response = await graph.massive(urlPattern, values, {
        cache: {
            expiresIn: flags.cache || null
        },
        method: flags.method ? String(flags.method).toUpperCase() : 'GET',
        saveOn: flags.save ? flags.save.replace(/~/g, homedir()) : null,
        binder: flags.binder,
        cycle: {
            async: flags.async ? flags.async !== 'false' : true,
            attempts: typeof flags.attempts === 'number' ? flags.attempts : 3,
            requests: typeof flags.requests === 'number' ? flags.requests : 50
        },
        type: flags.type
    });

    await graph.close();

    return flags.print === false ? '' : response;
}