import Graph from '../services/graph';
import { Command } from '@giancarl021/cli-core/interfaces';
import { Credentials } from '../interfaces';

const command : Command = async function () {
    const key = this.helpers.valueOrDefault(
        this.helpers.getFlag('c', 'credentials')?.toString(),
        this.extensions.vault.getData('credentials.default')
    );

    const graphVersion = this.helpers.valueOrDefault(this.helpers.getFlag('v', 'graph-version'), 'v1.0');

    if (!key) throw new Error('No credentials provided');

    const credentials: Credentials | null = JSON.parse(await this.extensions.vault.getSecret(key) ?? 'null');

    if (!credentials) throw new Error('Credentials not found');

    const graph = Graph(this, credentials.auth, credentials.isDelegated, graphVersion);

    const token = await graph.getAccessToken();

    return token;
}

export default command;