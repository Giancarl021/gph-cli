import type { CacheService } from 'graph-interface/lib/interfaces';
import type VaultExtension from '../interfaces/VaultExtension';
import hash from '../util/hash';

export default function VaultCache(
    vault: VaultExtension,
    credentialsKey: string
): CacheService {
    const credentialsId = hash(credentialsKey);

    async function expire(key: string) {
        try {
            await vault.temp.remove(`cache.${credentialsId}.${hash(key)}`);
        } catch {
            // Do nothing if fails
        }
    }

    async function has(key: string): Promise<boolean> {
        try {
            const item = await vault.temp.get(
                `cache.${credentialsId}.${hash(key)}`
            );

            if (!item) return false;

            if (
                item.expiresOn &&
                new Date(item.expiresOn).getTime() < Date.now()
            ) {
                await expire(key);
                return false;
            }

            return Boolean(item);
        } catch {
            return false;
        }
    }

    async function get<T>(key: string): Promise<T> {
        if (!(await has(key))) {
            throw new Error(`Key "${key}" not found in cache.`);
        }

        const item = await vault.temp.get(
            `cache.${credentialsId}.${hash(key)}`
        );

        if (!item) {
            throw new Error(`Key "${key}" not found in cache.`);
        }

        return item.value as T;
    }

    async function set<T>(
        key: string,
        value: T,
        expiration?: number
    ): Promise<void> {
        const expiresOn = expiration
            ? new Date(Date.now() + expiration * 1000).toISOString()
            : undefined;

        await vault.temp.set(`cache.${credentialsId}.${hash(key)}`, {
            value,
            expiresOn
        });
    }

    return {
        expire,
        has,
        get,
        set
    };
}
