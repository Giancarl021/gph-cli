import { Command } from '@giancarl021/cli-core/interfaces';
import { PartialMassiveOptions } from 'graph-interface/lib/interfaces';
import { existsSync as exists } from 'fs';
import { readFile } from 'fs/promises';
import locate from '@giancarl021/locate';

import Graph from '../services/graph';

import constants from '../util/constants';
import validateRequestCommandInput, {
    parseHeaders
} from '../util/validate-request-command-input';

const command: Command = async function (args) {
    const {
        credentials,
        endpoint: pattern,
        body,
        headers,
        method,
        useCache,
        graphVersion
    } = await validateRequestCommandInput(this);

    const _values = String(this.helpers.getArgAt(1));
    let values: string[] | string[][];

    if (_values.startsWith('@from')) {
        const _path = _values.split(':').pop();
        if (!_path) throw new Error('Path to file not informed');

        const path = locate(_path.trim(), true);

        if (!exists(path)) throw new Error('File not found');

        let data: any;

        try {
            data = JSON.parse(await readFile(path, 'utf8'));
        } catch {
            throw new Error('File not a valid JSON');
        }

        if (typeof data !== 'object' || !Array.isArray(data))
            throw new Error('Invalid JSON format');

        values = (data as any[]).map((item) =>
            Array.isArray(item) ? item.map(String) : String(item)
        ) as string[] | string[][];
    } else {
        values = _values.split(';').map((list) => list.split(','));
    }

    if (!values.length) throw new Error('No interpolation values provided');

    const attempts = Number(this.helpers.getFlag('attempts')) || undefined;
    const binderIndex =
        Number(this.helpers.getFlag('binder-index')) || undefined;
    const requestsPerAttempt =
        Number(this.helpers.getFlag('requests-per-attempt')) || undefined;
    const nullifyErrors = this.helpers.hasFlag(
        'lossy',
        'nullify',
        'nullify-errors'
    );

    if (attempts && attempts < 0)
        throw new Error('Attempts must be greater than 0');
    if (binderIndex && binderIndex < 0)
        throw new Error('Binder index must be greater than 0');
    if (requestsPerAttempt && requestsPerAttempt < 0)
        throw new Error('Requests per attempt must be greater than 0');

    const batchRequestHeaders = parseHeaders(this, 'batch-headers');

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
        values,
        attempts,
        nullifyErrors,
        requestsPerAttempt
    } as PartialMassiveOptions;

    if (batchRequestHeaders) options.batchRequestHeaders = batchRequestHeaders;
    if (binderIndex) options.binderIndex = binderIndex;

    const result = await graph.massive<object>(pattern, options);

    return constants.cli.asString(result);
};

export default command;
