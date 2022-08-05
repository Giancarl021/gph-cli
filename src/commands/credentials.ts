import { Commands } from '@giancarl021/cli-core/interfaces';
import { Credentials } from '../interfaces';

const credentialsKeyRegex = /^[0-9a-z]+$/i;

function checkKey(key: string) {
    if (!key) throw new Error('No key provided');

    if (!credentialsKeyRegex.test(key)) throw new Error('Invalid key name');
}

const commands: Commands = {
    async set(args) {
        const [key] = args;

        checkKey(key);

        const clientId = this.helpers.getFlag('client-id', 'c');
        const clientSecret = this.helpers.getFlag('client-secret', 's');
        const tenantId = this.helpers.getFlag('tenant-id', 't');

        if (!clientId) throw new Error('No client id provided');
        if (!clientSecret) throw new Error('No client secret provided');
        if (!tenantId) throw new Error('No tenant id provided');

        const isDelegated =
            this.helpers.hasFlag('delegated', 'd') ||
            !this.helpers.hasFlag('no-delegated', 'no-d');

        const overwrite = this.helpers.hasFlag('force', 'f');

        const credentials = {
            auth: {
                clientId,
                clientSecret,
                tenantId
            },
            isDelegated
        } as Credentials;

        const credentialsString = JSON.stringify(credentials);

        const hasSecret = Boolean(await this.extensions.vault.getSecret(key));

        if (!overwrite && hasSecret)
            throw new Error(
                'Credentials already exists, use "--force" to overwrite'
            );

        await this.extensions.vault.setSecret(key, credentialsString);

        const keys = this.extensions.vault.getData('credentials.keys');
        keys.push(key);
        this.extensions.vault.setData('credentials.keys', [...new Set(keys)]);

        return 'Credentials set';
    },

    async get(args) {
        const [key] = args;

        checkKey(key);

        const credentialsString = await this.extensions.vault.getSecret(key);

        if (!credentialsString)
            throw new Error(`Credentials "${key}" not found`);

        const credentials = JSON.parse(credentialsString) as Credentials;

        return `${key} Credentials:
    Client Id: ${credentials.auth.clientId}
    Client Secret: ${credentials.auth.clientSecret}
    Tenant Id: ${credentials.auth.tenantId}
    Delegated: ${credentials.isDelegated ? 'Yes' : 'No'}`;
    },

    list() {
        const keyList = this.extensions.vault.getData('credentials.keys');

        if (!keyList.length) return 'No credentials stored';

        const out = keyList.map((c: string) => `    * ${c}`).join('\n');

        return `Credentials List:\n${out}`;
    },

    async remove(args) {
        const [key] = args;

        checkKey(key);

        const hasSecret = Boolean(await this.extensions.vault.getSecret(key));

        if (!hasSecret) throw new Error(`Credentials "${key}" not set`);

        await this.extensions.vault.removeSecret(key);

        const keys = this.extensions.vault.getData('credentials.keys');
        keys.splice(keys.indexOf(key), 1);
        this.extensions.vault.setData('credentials.keys', keys);

        const defaultCredentials = this.extensions.vault.getData(
            'credentials.default'
        );

        if (defaultCredentials === key)
            this.extensions.vault.setData('credentials.default', null);

        return `Credentials "${key}" removed`;
    },

    default: {
        set(args) {
            const [key] = args;

            checkKey(key);

            this.extensions.vault.setData('credentials.default', key);

            return `Default Credentials set to "${key}"`;
        },

        get() {
            const defaultCredentials = this.extensions.vault.getData(
                'credentials.default'
            );

            if (!defaultCredentials) return 'No default credentials set';

            return `Default Credentials: ${defaultCredentials}`;
        },

        unset() {
            this.extensions.vault.setData('credentials.default', null);

            return 'Default Credentials unset';
        }
    }
};

export default commands;
