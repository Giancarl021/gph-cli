const safeEval = require('safe-eval');
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
    token: {
        save: 'string'
    },
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
        values: '!array',
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
            if(!fn) return null;
            return safeEval(fn);
        };

        let fn;

        if (required) {
            fn = tryUntil(fn => !!fn, builder, _query);
        } else {
            fn = tryUntil(null, builder, _query);
        }

        if (!fn) return null;

        return fn.toString();

    } else if (_type === 'array') {
        let arr;
        const toArr = str => str.split(',').map(e => e.trim());
        if (required) {
            arr = toArr(askUntil(r => r.split(',').filter(e => e).length, question, _query));
        } else {
            arr = toArr(question(_query));
        }

        return arr.length ? arr.join(',') : null;

    } else if (_type === 'number') {
        let n;
        if (required) {
            n = parseInt(askUntil(r => !isNaN(parseInt(r)), question, _query));
        } else {
            n = parseInt(question(_query));
        }

        return n || null;

    } else {
        let str;
        if (required) {
            str = askUntil(r => !!r, question, _query);
        } else {
            str = question(_query);
        }
        return str || null;
    }
}