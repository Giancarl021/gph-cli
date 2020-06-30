const getGraphInstance = require('../services/graph');
const getCredentials = require('../util/credentials');
const {
    homedir
} = require('os');

module.exports = async function (_, flags) {
    const credentials = getCredentials(flags.c || flags.credentials);
    const graph = await getGraphInstance(credentials, flags.version || 'v1.0');

    const response = await graph.getToken({
        saveOn: flags.save ? flags.save.replace(/~/g, homedir()) : null,
    });

    await graph.close();

    return flags.print === false ? '' : response;
}