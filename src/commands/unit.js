const getGraphInstance = require('../services/graph');
const getCredentials = require('../util/credentials');
const { homedir } = require('os');
const truncate = require('../util/truncate');

module.exports = async function (args, flags) {
    const credentials = getCredentials(flags.c || flags.credentials);
    const graph = await getGraphInstance(credentials, flags.version || 'v1.0');
    
    const [url] = args;

    if(!url) throw new Error('URL must be specified');

    const response = await graph.unit(url, {
        cache: {
            expiresIn: flags.cache || null
        },
        method: flags.method ? String(flags.method).toUpperCase() : 'GET',
        saveOn: flags.save ? flags.save.replace(/~/g, homedir()) : null,
        fields: flags.fields ? flags.fields.split(',').map(e => e.trim()) : null,
        headers: flags.headers || null,
        body: flags.body || null,
    });

    await graph.close();

    return flags.print === false ? '' : truncate(response, flags.truncate);
}