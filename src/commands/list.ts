import { ListOptions } from 'graph-interface/lib/interfaces';
import { Command } from '@giancarl021/cli-core/interfaces';

import Graph from '../services/graph';

import constants from '../util/constants';
import validateRequestCommandInput from '../util/validate-request-command-input';

const command: Command = async function (args) {
    const {
        credentials,
        endpoint,
        body,
        headers,
        method,
        useCache,
        graphVersion
    } = await validateRequestCommandInput(this);

    const limit = Number(this.helpers.getFlag('limit')) || undefined;
    const offset = Number(this.helpers.getFlag('offset')) || undefined;

    if (limit && limit < 0) throw new Error('Limit must be greater than 0');
    if (offset && offset < 0) throw new Error('Offset must be greater than 0');

    const graph = Graph(
        this,
        credentials.auth,
        credentials.isDelegated,
        graphVersion
    );

    const options = {
        body,
        headers,
        method,
        useCache,
        limit,
        offset
    } as ListOptions;
    
    const result = await graph.list<object>(endpoint, options);

    return constants.cli.asString(result);
};

export default command;
