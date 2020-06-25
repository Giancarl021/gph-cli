const { argv } = require('yargs');
const createEnvironment = require('./src/services/environment');
const createCommander = require('./src/services/command');

async function main() {
    const env = createEnvironment();
    env.build();

    const command = String(argv._.shift()).toLowerCase();    
    const operations = argv._.map(String);
    delete argv._;
    delete argv['$0'];
    const flags = argv;

    const commander = createCommander(command, operations, flags);

    await commander.run();
}

main().catch(console.error);