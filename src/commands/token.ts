import Graph from '../services/graph';
import getCredentialsId from '../util/credentialsId';
import { Command } from '@giancarl021/cli-core/interfaces';
import { Credentials } from '../interfaces';

const command : Command = async function () {
    const credentialsId = getCredentialsId(this.helpers.getFlag('c', 'credentials').toString());
    const graphVersion = this.helpers.valueOrDefault(this.helpers.getFlag('v', 'graph-version'), 'v1.0');

    let token = this.extensions.vault.getData(credentialsId);

    if (!token) {
        const credentials: Credentials = this.extensions.vault.getSecret(credentialsId);

        if (!credentials) throw new Error(`Credentials "${credentialsId}" not found`);
        const graph = Graph(credentials.auth, credentials.isDelegated, graphVersion);

        token = await graph.getAccessToken();
    }

    return token;
}

export default command;