import { Command } from '@giancarl021/cli-core/interfaces';

import Graph from '../services/graph';
import getCredentialsId from '../util/credentialsId';

const command : Command = function (args) {
    const credentialsId = getCredentialsId(this.helpers.getFlag('c', 'credentials').toString());
    const graphVersion = this.helpers.valueOrDefault(this.helpers.getFlag('v', 'graph-version'), 'v1.0');

    return '';
}

export default command;