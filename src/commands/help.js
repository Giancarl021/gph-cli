const data = require('../util/help.json');

module.exports = function (args) {
    let info;
    try {
        info = navigate(data, args);
    } catch(err) {
        return 'Error: ' + err.message;
    }

    return info;
}

function navigate(object, arr) {
    if(typeof object !== 'object' || !arr.length) return object;
    const index = arr.shift();
    if(!object[index] && !object.operations && !object.operations[index]) {
        throw new Error('This command sequence does not exists');
    }

    return navigate(object[index] || object.operations[index], arr);
}