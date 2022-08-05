import { CommandInternal, Commands } from '@giancarl021/cli-core/interfaces';
import { existsSync as fileExists } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import locate from '@giancarl021/locate';

import { Credentials, Template } from '../interfaces';

import constants from '../util/constants';

import { unit, list, massive } from '.';
import customHelpers from '../util/custom-helpers';

const commands: Commands = {
    async save(args, flags) {
        const [command, ..._args] = args;
        if (!command) throw new Error('No command provided');

        if (!constants.template.availableCommands.includes(command))
            throw new Error(
                `Command "${command}" not available for templates, the command should be one of ${constants.template.availableCommands.join(
                    ', '
                )}`
            );

        const key = this.helpers.hasFlag('credentials', 'c') ?
            this.helpers.getFlag('credentials', 'c')!.toString() :
            '@default';

        if (!key) throw new Error('No credentials provided');

        const output = this.helpers.getFlag('o', 'output')?.toString();

        if (!output) throw new Error('No output file provided');

        const credentials: Credentials | null = JSON.parse(
            (await this.extensions.vault.getSecret(key === '@default' ? this.extensions.vault.getData('credentials.default') : key)) ?? 'null'
        );

        if (!credentials) throw new Error('Credentials not found');

        const _flags = { ...flags };

        delete _flags['c'];
        delete _flags['credentials'];
        delete _flags['o'];
        delete _flags['output'];

        const template: Template = {
            command,
            args: _args,
            flags: _flags,
            credentialsId: key
        };

        const path = locate(output, true);

        await writeFile(path, JSON.stringify(template, null, 2));

        return `Request template saved on "${path}"`;
    },

    async run(args, flags) {
        const [file, ...additionalArgs] = args;

        if (!file) throw new Error('No template file provided');

        const path = locate(file, true);

        if (!fileExists(path)) throw new Error('Template file not found');

        let template: Template;
        try {
            template = JSON.parse(await readFile(path, 'utf8'));
        } catch {
            throw new Error('Invalid template file');
        }

        if (!template) throw new Error('Invalid template file');

        const key = this.helpers.hasFlag('credentials', 'c')
            ? this.helpers.getFlag('c', 'credentials')!.toString()
            : (
                template.credentialsId === '@default' ?
                    this.extensions.vault.getData('credentials.default') :
                    template.credentialsId
            );

        const credentials: Credentials | null = JSON.parse(
            (await this.extensions.vault.getSecret(key)) ?? 'null'
        );

        if (!credentials) throw new Error('Credentials not found');

        const _flags = { ...template.flags, ...flags };

        delete _flags['c'];
        delete _flags['credentials'];

        const commandArgs = [...template.args, ...additionalArgs];
        const commandFlags = { ..._flags, credentials: key };

        const commandThis = {
            ...this,
            helpers: customHelpers(commandArgs, commandFlags)
        } as CommandInternal;

        let callback: () => string | Promise<string>;

        switch (template.command) {
            case 'unit':
                callback = unit.bind(commandThis, commandArgs, commandFlags);
                break;
            case 'list':
                callback = list.bind(commandThis, commandArgs, commandFlags);
                break;
            case 'massive':
                callback = massive.bind(commandThis, commandArgs, commandFlags);
                break;
            default:
                throw new Error(
                    `Unknown or unavailable command: "${template.command}"`
                );
        }

        return await callback();
    }
};

export default commands;
