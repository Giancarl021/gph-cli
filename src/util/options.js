const defaultOptions = {
    version: 'string',
    method: 'string',
    save: 'string',
    cache: 'number'
};

const options = {
    unit: {
        ...defaultOptions,
        fields: 'array'
    },
    list: {
        ...defaultOptions,
        map: 'function',
        filter: 'function',
        reduce: 'function',
        limit: 'number',
        offset: 'number'
    },
    massive: {
        ...defaultOptions,
        type: '!unit|list',
        binder: '!string',
        async: 'boolean',
        attemps: 'number',
        requests: 'number'
    }
};

module.exports = function (request) {
    const opt = options[request.type];
    console.log(opt);
}