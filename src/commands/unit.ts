import { Command } from '@giancarl021/cli-core/interfaces';
import { Credentials } from '../interfaces';

import Graph from '../services/graph';
import getCredentialsId from '../util/hash';
import constants from '../util/constants';
import { HttpHeaders } from 'graph-interface/lib/interfaces';

const command : Command = async function (args) {
    const key = this.helpers.valueOrDefault(
        this.helpers.getFlag('c', 'credentials').toString(),
        this.extensions.vault.getData('credentials.default')
    );

    const useCache = this.helpers.hasFlag('cache', 'C');
    const body = this.helpers.getFlag('body', 'b');
    const method = this.helpers.valueOrDefault(
        this.helpers.getFlag('method', 'm'),
        'GET'
    ).toUpperCase();
    const headers = String(this.helpers.getFlag('headers', 'H'))
        .split(';')
        .map(e => e.trim())
        .reduce((obj: HttpHeaders, item: string) => {
            const [key, value] = item
                .split(':')
                .map(e => e.trim());

            obj[key] = value;

            return obj;
        }, {}) || {};

    const [endpoint] = args;

    const graphVersion = this.helpers.valueOrDefault(this.helpers.getFlag('v', 'graph-version'), 'v1.0');

    if (!endpoint) throw new Error('No endpoint provided');
    if (!key) throw new Error('No credentials provided');

    const credentials: Credentials | null = JSON.parse(this.extensions.vault.getSecret(key) ?? 'null');

    if (!credentials) throw new Error('Credentials not found');

    const graph = Graph(this, credentials.auth, credentials.isDelegated, graphVersion);

    const result = await graph.unit(endpoint, {
        body,
        headers,
        method,
        useCache
    });

    const json = JSON.stringify(result, null, 4);

    return json;
}

export default command;