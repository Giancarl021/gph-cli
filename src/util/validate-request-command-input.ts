import { CommandInternal } from '@giancarl021/cli-core/interfaces';
import { HttpHeaders } from 'graph-interface/lib/interfaces';

import { Credentials } from '../interfaces';

export default async function (commandThis: CommandInternal) {
    const key = commandThis.helpers.valueOrDefault(
        commandThis.helpers.getFlag('c', 'credentials')?.toString(),
        commandThis.extensions.vault.getData('credentials.default')
    );

    const useCache = commandThis.helpers.hasFlag('cache', 'C');
    const body = commandThis.helpers.getFlag('body', 'b');
    const method = commandThis.helpers
        .valueOrDefault(commandThis.helpers.getFlag('method', 'm'), 'GET')
        .toUpperCase();
    const headers = parseHeaders(commandThis, 'H', 'headers');

    const endpoint = commandThis.helpers.getArgAt(0);

    const graphVersion = commandThis.helpers.valueOrDefault(
        commandThis.helpers.getFlag('v', 'graph-version'),
        'v1.0'
    );

    if (!endpoint) throw new Error('No endpoint provided');
    if (!key) throw new Error('No credentials provided');

    const credentials: Credentials | null = JSON.parse(
        (await commandThis.extensions.vault.getSecret(key)) ?? 'null'
    );

    if (!credentials) throw new Error('Credentials not found');

    return {
        credentials,
        endpoint,
        body,
        headers,
        method,
        useCache,
        graphVersion
    };
}

export function parseHeaders(
    commandThis: CommandInternal,
    ...flagNames: string[]
) {
    const [first, ...aliases] = flagNames;
    const headers = commandThis.helpers.hasFlag(first, ...aliases)
        ? String(commandThis.helpers.getFlag(first, ...aliases))
              .split(';')
              .map((e) => e.trim())
              .reduce((obj: HttpHeaders, item: string) => {
                  const [key, value] = item.split(':').map((e) => e.trim());

                  obj[key] = value;

                  return obj;
              }, {})
        : undefined;

    return headers;
}
