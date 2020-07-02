const help = require('./src/util/help.json');
const createFileHandler = require('./src/util/file');

const regex = /\[\/\/\]: # \(\^\)(.|\n)*\[\/\/\]: # \(\$\)/gim;

function replacer() {
    return `[//]: # (^)\n\n${specialChars(markdown(help))}\n\n[//]: # ($)`;

    function markdown(o, depth = 0) {
        const commands = [];
        for (const key in o) {
            const command = o[key];
            const i = Array(3 + depth).fill('#');
            commands.push(`${i.join('')} ${key} ${command.args ? command.args.join(' ') : ''}` +
                `\n${command.description || 'No description.'}` +
                (command.operations ? '\n\n**Operations:**' + parseOperations(command.operations) : '') +
                (command.flags ? '\n\n**Flags:**' + parseFlags(command.flags) : '')
            );
        }

        const r = commands.join('\n');

        return r;

        function parseOperations(operations) {
            return markdown(operations, depth + 1);
        }

        function parseFlags(flags) {
            if(typeof flags === 'string') {
                return '```\n' + flags + '\n```';
            }
            let r = '```\n';
            for(const key in flags) {
                const flag = flags[key];
                
                r += flag.description;
            }

            r += '\n```';

            return r;
        }
    }

    function specialChars(str) {
        const regex = /(<|>)/g;
        return str.replace(regex, _ => '\\' + _);
    }
}

function main() {
    const readme = createFileHandler('README.md');
    const content = readme.load();
    console.log(content);
    const r = replacer();
    readme.save(content.replace(regex, r));
}

main();