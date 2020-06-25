const createGraphInterface = require('graph-interface');

module.exports = async function (credentials, options) {
    return await createGraphInterface(credentials, {
        cache: {
            type: 'fs',
            fs: {
                path: 'data/cache'
            }
        },
        version: options.version
    });
}