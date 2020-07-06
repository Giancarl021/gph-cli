const createGraphInterface = require('graph-interface');

module.exports = async function (credentials, version) {
    return await createGraphInterface(credentials, {
        cache: {
            type: 'fs',
            fs: {
                path: __dirname.replace(/\\/g, '/') + '/../../data/cache'
            }
        },
        version
    });
}