import { CommandInternal } from '@giancarl021/cli-core/interfaces';
import { CacheService } from 'graph-interface/lib/interfaces';
import { Credentials } from '../interfaces';

import hash from './hash';

interface Expirations {
    [key: string]: Date | null;
}

export default function (internal: CommandInternal, credentials: Credentials) : CacheService {
    const expirations: Expirations = {};

    const credentialsHash = hash(`${credentials.auth.clientId}-${credentials.auth.clientSecret}-${credentials.auth.tenantId}::${credentials.isDelegated}`);

    function Key(key: string) {
        return `cache.${credentialsHash}.${key}`;
    }

    async function expire(key: string) {
        internal.extensions.vault.removeData(Key(key));
    }

    async function has(key: string) {
        const now = new Date();
        if (expirations[key] === null) return true;
        if (!expirations[key]) return false;

        if (now > expirations[key]!) {
            await expire(key);
            delete expirations[key];
            return false;
        }

        return true;
    }

    async function get<T>(key: string) {
        if (!await has(key)) throw new Error(`Item "${key}" not found in cache`);
        
        return internal.extensions.vault.getData(Key(key)) as T;
    }

    async function set<T>(key: string, value: T, expiration?: number) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + (expiration ?? 0));

        expirations[key] = expiration ? now : null;

        internal.extensions.vault.setData(Key(key), value);
    }

    return {
        get,
        set,
        has,
        expire
    }
}