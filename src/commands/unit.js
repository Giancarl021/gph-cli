const result = require('../util/result');
const getGraphInstance = require('../services/graph');

module.exports = async function (args, flags) {
    const graph = await getGraphInstance({}, {
        version: 'v1.0'
    });

    const [url] = args;

    return result(await graph.unit(url, {
        cache: {
            expiresIn: flags.cache || null
        },
        method: flags.method ? String(flags.method).toUpperCase() : 'GET',
        saveOn: flags.save || null,
        fields: flags.fields ? flags.fields.split(',').map(e => e.trim()) : null
    }));
}