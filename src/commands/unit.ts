import { Command } from '@giancarl021/cli-core/interfaces';
import { UnitOptions } from 'graph-interface/lib/interfaces';

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
        useCache
    } as UnitOptions;

    const result = await graph.unit<object>(endpoint, options);

    return constants.cli.asString(result);
};

export default command;
