const getGraphInstance = require('../services/graph');
const getCredentials = require('../util/credentials');
const {
    homedir
} = require('os');

module.exports = async function (args, flags) {
    const credentials = getCredentials(flags.c || flags.credentials);
    const graph = await getGraphInstance(credentials, flags.version || 'v1.0');

    const [url, _values] = args;
    
    const values = String(_values).split(',').map(e => e.trim());

    /* TODO
     * Sanitize and validate values and required flags
    */


    const response = await graph.massive(url, values, {
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

    return flags.print === false ? '' : response;
}