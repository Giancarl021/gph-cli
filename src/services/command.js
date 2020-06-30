const commands = {
    credentials: require('../commands/credentials'),
    token: require('../commands/token'),
    unit: require('../commands/unit'),
    list: require('../commands/list'),
    massive: require('../commands/massive'),
    request: require('../commands/request'),
    export: require('../commands/export'),
    import: require('../commands/import'),
    exec: require('../commands/exec')
};

const helper = require('../commands/help');

module.exports = function(command, args, flags) {

    async function run() {
        if(flags['?']) {
            const nav = [];
            if(command) nav.push(command);
            if(args) nav.push(...args);
            console.log(helper(nav));
            return;
        }
        if(!commands[command]) {
            console.log('This command does not exists');
            return;
        }

        let result;
        try {
            result = await commands[command](args, flags);
            console.log(result);
        } catch(error) {
            console.log('Error: ' + error.message);
        }
    }

    return {
        run
    };
}