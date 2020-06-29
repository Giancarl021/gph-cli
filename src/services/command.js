const { command } = require("yargs");

const commandPath = '../commands/';

const commands = {
    credentials: require(commandPath + 'credentials'),
    unit: require(commandPath + 'unit'),
    list: require(commandPath + 'list'),
    massive: require(commandPath + 'massive')
};

module.exports = function(command, args, flags) {

    async function run() {
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