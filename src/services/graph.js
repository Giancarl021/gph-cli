const createGraphInterface = require('graph-interface');

module.exports = async function (credentials, version, tokenCache = true) {
    return await createGraphInterface(credentials, {
        cache: {
            type: 'fs',
            tokenCache,
            fs: {
                path: 'data/cache'
            }
        },
        version
    });
}