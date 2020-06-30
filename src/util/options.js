const {
    question,
    keyInSelect
} = require('readline-sync');

const {
    askUntil,
    tryUntil
} = require('./until');

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
        // ...defaultOptions,
        map: 'function',
        filter: 'function',
        reduce: 'function',
        // limit: 'number',
        // offset: 'number'
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

        if (r === null) continue;

        request.options[key] = r;
    }
}

function askType(type, query) {
    const listUntil = askUntil.bind(this, i => i !== -1, keyInSelect);
    let _type = type,
        _query = query,
        required = false;

    if (type.charAt(0) === '!') {
        _type = type.substr(1);
        _query += '[REQUIRED] ';
        required = true;
    }

    if (_type === 'boolean') {
        const opt = ['true', 'false'];
        let index;
        if (required) {
            index = listUntil(opt, _query);
        } else {
            index = keyInSelect(opt, _query);
        }

        return opt[index] || null;

    } else if (_type.includes('|')) {
        const opt = _type.split('|');
        let index;
        if (required) {
            index = listUntil(opt, _query);
        } else {
            index = keyInSelect(opt, _query);
        }

        return opt[index] || null;

    } else if (_type === 'function') {
        const builder = query => {
            const fn = question(query);
            return Function('return ' + fn)();
        };

        let fn;

        if (required) {
            fn = tryUntil(fn => !!fn, builder, _query);
        } else {
            fn = tryUntil(null, builder, _query);
        }

        if(!fn) return null;

        return fn.toString();

    } else if(_type === 'string') {
        let r;
        let first = true;
        do {
            if (!first) console.log('Invalid input!');
            r = question(_query);
            first = false;
        } while (!r);
        return r;
    }
}