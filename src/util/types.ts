import type {} from '@giancarl021/cli-core-vault-extension';
import type { Credentials } from 'graph-interface/lib/interfaces';

/**
 * Credentials stored in the vault (without the client secret)
 */
interface StorageCredentials extends Omit<Credentials, 'clientSecret'> {
    /**
     * The credentials key, used to identify the credentials in the vault
     * from user input
     */
    key: string;
    /**
     * Whether the credentials are for delegated access (user context) or application access (app context)
     */
    isDelegated: boolean;
}

declare module '@giancarl021/cli-core-vault-extension' {
    export interface VaultExtensionSchema {
        /**
         * Credentials stored in the vault
         */
        credentials: {
            /**
             * The default credentials key to use when none is specified
             */
            default: string | undefined;
            /**
             * The stored credentials items, keyed by the hash of the credentials key
             */
            items: Record<string, StorageCredentials>;
        };
    }

    /**
     * Temporary schema for vault extension to store cache data
     */
    export interface VaultExtensionTempSchema {
        /**
         * Cache for Graph requests, keyed by a hash of the credentials and the request
         */
        cache: Record<
            string,
            Record<
                string,
                {
                    expiresOn?: string;
                    value: unknown;
                }
            >
        >;
    }
}
