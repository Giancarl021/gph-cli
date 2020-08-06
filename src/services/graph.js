const createGraphInterface = require('graph-interface');
const createDesktopMiddleware = require('graph-interface-desktop-provider');

const dir = __dirname.replace(/\\/g, '/') + '/../../data/';
const authMiddleware = createDesktopMiddleware({ refreshTokenPath: dir + 'delegated' });

module.exports = async function (credentials, version) {
    const { delegated } = credentials;

    return await createGraphInterface(credentials, {
        authenticationProvider: delegated ? authMiddleware : null,
        cache: {
            type: 'fs',
            fs: {
                path: dir + 'cache'
            }
        },
        version
    });
}