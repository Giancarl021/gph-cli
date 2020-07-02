const helper = require('./src/commands/help');
const createDirectoryHandler = require('./src/util/directory');
const createFileHandler = require('./src/util/file');

const regex = /^\[\/\/\]: # \(ANCHOR\)[.\n\r]*\[\/\/\]: # \(END-ANCHOR\)$/gm;

function replacer(str) {
    return `[//]: # (ANCHOR)\n${str}\n[//]: # (END-ANCHOR)`;
}

function convert(help) {
    return help;
}

function main() {
    const dir = createDirectoryHandler('src/commands');
    const commands = dir.files().map(cmd => cmd.replace(/\..*$/, '')).filter(cmd => cmd !== 'help');
    const readme = createFileHandler('README.md');

    let r = helper([]);

    console.log(r);
    // process.exit();

    for(const command of commands) {
        helper([command]);
    }

    const content = readme.load();

    readme.save(content.replace(regex, replacer(r)));
}

main();