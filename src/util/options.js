const {
    question,
    keyInSelect
} = require('readline-sync');

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
    request.options = {};
    for (const key in opt) {
        const r = askType(opt[key], `Insert the ${key}: `);
        if (r === null) {
            continue;
        }
        request.options[key] = r;
    }
}

function askType(type, query) {
    let _type = type,
        _query = query,
        required = false;

    if (type.charAt(0) === '!') {
        _type = type.substr(1);
        _query += ' [REQUIRED] ';
        required = true;
    }

    if (_type === 'boolean') {
        
    } else if (_type.includes('|')) {
        const opt = _type.split('|');
        let first = true;
        let index;
        do {
            if (!first) console.log('Invalid input!');
            index = keyInSelect(opt, _query);
        } while (index !== -1);
        return opt[index];
    } else if (_type === 'function') {

    } else {
        let r;
        let first = true;
        let r;
        do {
            if (!first) console.log('Invalid input!');
            r = question(_query);
        } while (!r);
        return r;
    }
}