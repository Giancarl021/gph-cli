import type { Credentials } from '../interfaces';
import type CommandContext from '../interfaces/CommandContext';
import type VaultExtension from '../interfaces/VaultExtension';
import constants from './constants';
import hash from './hash';

type Logger = CommandContext['logger'];
type Helpers = CommandContext['helpers'];

/**
 * Checks if credentials with the given key exist in the vault.
 * It also removes invalid credentials if the secret or the data is missing.
 * @param vault The vault extension instance accessible from `this.extensions.vault` in the command context
 * @param key The credentials key to check
 * @returns `true` if the credentials exist, `false` otherwise
 */
export async function hasCredentials(
    vault: VaultExtension,
    key: string
): Promise<boolean> {
    try {
        await getCredentials(vault, key);

        return true;
    } catch {
        return false;
    }
}

/**
 * Lists all the credentials keys stored in the vault.
 * @param vault The vault extension instance accessible from `this.extensions.vault` in the command context
 * @returns An array of credentials keys
 */
export async function listCredentialKeys(
    vault: VaultExtension
): Promise<string[]> {
    const allCredentials = await vault.data.get('credentials.items', {});

    return Object.values(allCredentials).map(c => c.key);
}

/**
 * Gets the credentials with the given key from the vault.
 * Removes invalid credentials if the secret or the data is missing.
 * @param vault The vault extension instance accessible from `this.extensions.vault` in the command context
 * @param key The credentials key to get
 * @returns The credentials object
 * @throws If the key is invalid or the credentials do not exist
 */
export async function getCredentials(
    vault: VaultExtension,
    key: string
): Promise<Credentials> {
    if (!key || !constants.credentials.regex.test(key))
        throw new Error(
            'Invalid credentials key. It must be a non-empty alphanumeric string including dashes and underscores'
        );

    if (constants.credentials.reservedKeys.includes(key))
        throw new Error(
            `Invalid credentials key. '${key}' is a reserved credentials key`
        );

    const keyHash = hash(key);

    const allCredentials = await listCredentialKeys(vault);

    const availableCredentialsMessage = `Available credentials: ${
        allCredentials.length > 0 ? allCredentials.join(', ') : '<none>'
    }`;

    const credentials = await vault.data.get(`credentials.items.${keyHash}`);

    if (!credentials) {
        try {
            // Remove invalid key secret if exists
            vault.secrets.remove(key);
        } catch {
            // Do nothing if fails
        }

        throw new Error(
            `Credentials with key '${key}' not found. ${availableCredentialsMessage}`
        );
    }

    let secret: string | undefined;

    try {
        secret = vault.secrets.get(hash(keyHash));
    } catch (err) {
        // Do nothing if fails
    }

    if (!secret) {
        await vault.data.remove(`credentials.items.${keyHash}`);

        throw new Error(
            `Credentials with key '${key}' not found. ${availableCredentialsMessage}`
        );
    }

    return {
        auth: {
            clientId: credentials.clientId,
            tenantId: credentials.tenantId,
            clientSecret: secret
        },
        isDelegated: credentials.isDelegated
    };
}

/**
 * Gets the credentials with the given key from the vault, or the default credentials if no key is provided.
 * @param vault The vault extension instance accessible from `this.extensions.vault` in the command context
 * @param key The credentials key to get (optional)
 * @returns The credentials object
 * @throws If the key is invalid, no key is provided and no default is set, or the credentials do not exist
 */
export async function getCredentialsOrDefault(
    vault: VaultExtension,
    helpers: Helpers,
    key?: string
): Promise<{ key: string; credentials: Credentials }> {
    const credentialsKey = String(
        helpers.getFlag('credentials', 'c') ??
            (await vault.data.get('credentials.default')) ??
            ''
    );

    if (!credentialsKey)
        throw new Error(
            'No credentials key provided and no default credentials set'
        );

    return {
        key: credentialsKey,
        credentials: await getCredentials(vault, credentialsKey)
    };
}

/**
 * Sets the credentials with the given key in the vault.
 * @remarks
 * If the credentials with the given key already exist, they will be overwritten.
 * @param vault The vault extension instance accessible from `this.extensions.vault` in the command context
 * @param key The credentials key to set
 * @param credentials The credentials object to set
 * @throws If the key is invalid or a reserved key
 */
export async function setCredentials(
    vault: VaultExtension,
    key: string,
    credentials: Credentials
): Promise<void> {
    if (!key || !constants.credentials.regex.test(key))
        throw new Error(
            'Invalid credentials key. It must be a non-empty alphanumeric string including dashes and underscores'
        );

    if (constants.credentials.reservedKeys.includes(key))
        throw new Error(
            `Invalid credentials key. '${key}' is a reserved credentials key`
        );

    const keyHash = hash(key);

    await vault.data.set(`credentials.items.${keyHash}`, {
        key,
        clientId: credentials.auth.clientId,
        tenantId: credentials.auth.tenantId,
        isDelegated: credentials.isDelegated
    });

    vault.secrets.set(hash(keyHash), credentials.auth.clientSecret);
}

export async function removeCredentials(
    vault: VaultExtension,
    key: string
): Promise<void> {
    if (!key || !constants.credentials.regex.test(key))
        throw new Error(
            'Invalid credentials key. It must be a non-empty alphanumeric string including dashes and underscores'
        );

    if (constants.credentials.reservedKeys.includes(key))
        throw new Error(
            `Invalid credentials key. '${key}' is a reserved credentials key`
        );

    const keyHash = hash(key);

    const credentials = await vault.data.get(`credentials.items.${keyHash}`);

    if (!credentials)
        throw new Error(`Credentials with key '${key}' not found`);

    await vault.data.remove(`credentials.items.${keyHash}`);

    try {
        vault.secrets.remove(hash(keyHash));
    } catch {
        // Do nothing if fails
    }

    // Remove default if the removed credentials was the default one
    if ((await vault.data.get('credentials.default')) === key) {
        await vault.data.remove('credentials.default');
    }
}

/**
 * Formats the credentials information for display.
 * @param logger The logger instance accessible from `this.logger` in the command context
 * @param key The credentials key
 * @param credentials The credentials object
 * @param showSecret Whether to show the client secret or mask it (default: `false`)
 * @returns The formatted credentials string
 */
export function formatCredentials(
    logger: Logger,
    key: string,
    credentials: Credentials,
    showSecret: boolean = false
): string {
    return `${logger.colors.whiteBright('Credentials:')}
  ${logger.colors.yellowBright('Credentials key:')} ${logger.colors.cyan(key)}
  ${logger.colors.yellowBright('Credentials ID:')} ${logger.colors.gray(hash(key))}
  ${logger.colors.yellowBright('Client ID:')} ${logger.colors.white(credentials.auth.clientId)}
  ${logger.colors.yellowBright('Tenant ID:')} ${logger.colors.white(credentials.auth.tenantId)}
  ${logger.colors.yellowBright('Client Secret:')} ${logger.colors.redBright(showSecret ? credentials.auth.clientSecret : '*****')}
  ${logger.colors.yellowBright('Delegated:')} ${logger.colors.white(credentials.isDelegated ? 'Yes' : 'No')}`;
}
