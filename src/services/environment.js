const createDirectoryHandler = require('../util/directory');

module.exports = function () {
    const dir = [
        'data',
        'data/hash',
        'data/requests',
        'data/cache',
        'data/delegated'
    ];

    function build() {
        dir.forEach(path => createDirectoryHandler(path).make(true));
    }

    function destroy() {
        dir.forEach(path => createDirectoryHandler(path).remove(true));
    }

    return {
        build,
        destroy
    };
}