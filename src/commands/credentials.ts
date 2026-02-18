import { defineCommand } from '@giancarl021/cli-core';
import {
    getCredentials,
    formatCredentials,
    hasCredentials,
    removeCredentials,
    setCredentials,
    listCredentialKeys
} from '../util/credentials';
import { Credentials } from '../interfaces';
import { prompt, flagOrPrompt } from '../util/prompt';
import hash from '../util/hash';

export default defineCommand({
    async set() {
        const { key } = this.helpers.requireArgs('key');

        const quiet = this.helpers.hasFlag('quiet', 'q');
        const showSecret = this.helpers.hasFlag('show-sensitive-information');
        const jsonOutput = this.extensions.json.hasJsonOutput();
        const setDefault = this.helpers.hasFlag('default', 'D');

        const credentials: Credentials = {
            auth: {
                clientId: await flagOrPrompt(
                    this.helpers,
                    'client-id',
                    ['c'],
                    'Client ID'
                ),
                clientSecret: await flagOrPrompt(
                    this.helpers,
                    'client-secret',
                    ['s'],
                    'Client Secret'
                ),
                tenantId: await flagOrPrompt(
                    this.helpers,
                    'tenant-id',
                    ['t'],
                    'Tenant ID'
                )
            },
            isDelegated: this.helpers.hasFlag('delegated', 'd')
                ? this.helpers.getFlag('delegated', 'd') === true
                : ['y', 'yes'].includes(
                      (await prompt('Is Delegated (y/n)')).toLowerCase()
                  )
        };

        await setCredentials(this.extensions.vault, key, credentials);

        if (setDefault) {
            await this.extensions.vault.data.set('credentials.default', key);
        }

        if (quiet || jsonOutput) return key;

        return formatCredentials(this.logger, key, credentials, showSecret);
    },
    async get() {
        const { key } = this.helpers.requireArgs('key');

        const quiet = this.helpers.hasFlag('quiet', 'q');
        const jsonOutput = this.extensions.json.hasJsonOutput();
        const showSecret = this.helpers.hasFlag('show-sensitive-information');

        const credentials = await getCredentials(this.extensions.vault, key);

        if (jsonOutput)
            return this.extensions.json.format({
                id: hash(key),
                key,
                ...credentials,
                auth: {
                    ...credentials.auth,
                    clientSecret: showSecret
                        ? credentials.auth.clientSecret
                        : undefined
                }
            });
        if (quiet) return key;

        return formatCredentials(this.logger, key, credentials, showSecret);
    },
    async list() {
        const quiet = this.helpers.hasFlag('quiet', 'q');
        const jsonOutput = this.extensions.json.hasJsonOutput();

        const allCredentials = await listCredentialKeys(this.extensions.vault);

        if (jsonOutput) return this.extensions.json.format(allCredentials);

        if (!allCredentials.length) {
            if (quiet) return this.NO_OUTPUT;

            return 'No credentials stored';
        }

        if (quiet) return allCredentials.join('\n');

        return `${this.logger.colors.whiteBright('Credentials List:')}
${allCredentials.map(c => `  * ${this.logger.colors.yellowBright(c)}`).join('\n')}`;
    },
    async remove() {
        const { key } = this.helpers.requireArgs('key');

        const quiet = this.helpers.hasFlag('quiet', 'q');
        const jsonOutput = this.extensions.json.hasJsonOutput();

        await removeCredentials(this.extensions.vault, key);

        if (quiet || jsonOutput) return key;

        return `Credentials "${this.logger.colors.yellowBright(key)}" removed`;
    },
    default: {
        async set() {
            const { key } = this.helpers.requireArgs('key');
            const quiet = this.helpers.hasFlag('quiet', 'q');
            const jsonOutput = this.extensions.json.hasJsonOutput();

            if (!(await hasCredentials(this.extensions.vault, key)))
                throw new Error(`Credentials "${key}" not found`);

            await this.extensions.vault.data.set('credentials.default', key);

            if (quiet || jsonOutput) return key;

            return `Default credentials set to "${this.logger.colors.yellowBright(key)}"`;
        },
        async get() {
            const defaultKey = await this.extensions.vault.data.get(
                'credentials.default'
            );

            const quiet = this.helpers.hasFlag('quiet', 'q');
            const jsonOutput = this.extensions.json.hasJsonOutput();
            const showSecret = this.helpers.hasFlag(
                'show-sensitive-information'
            );

            if (!defaultKey) throw new Error('No default credentials set');

            const credentials = await getCredentials(
                this.extensions.vault,
                defaultKey
            );

            if (jsonOutput)
                return this.extensions.json.format({
                    key: defaultKey,
                    ...credentials
                });
            if (quiet) return defaultKey;

            return formatCredentials(
                this.logger,
                defaultKey,
                credentials,
                showSecret
            );
        },
        async remove() {
            const defaultKey = await this.extensions.vault.data.get(
                'credentials.default'
            );

            const quiet = this.helpers.hasFlag('quiet', 'q');
            const jsonOutput = this.extensions.json.hasJsonOutput();

            if (!defaultKey) throw new Error('No default credentials set');

            await this.extensions.vault.data.set(
                'credentials.default',
                undefined
            );

            if (quiet || jsonOutput) return defaultKey;

            return `Default credentials "${this.logger.colors.yellowBright(defaultKey)}" removed`;
        }
    }
});
