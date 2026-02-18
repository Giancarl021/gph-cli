import { defineCommand } from '@giancarl021/cli-core';
import Graph from '../services/Graph';
import { getCredentialsOrDefault } from '../util/credentials';
import { jwtDecode } from 'jwt-decode';

export default defineCommand(async function () {
    const { credentials, key } = await getCredentialsOrDefault(
        this.extensions.vault,
        this.helpers
    );

    const jsonOutput = this.extensions.json.hasJsonOutput();
    const parseJwt = this.helpers.hasFlag('parse-jwt');
    const parseJwtFlag = String(
        this.helpers.getFlag('parse-jwt')
    ).toLowerCase();
    let parseJwtPart: 'header' | 'payload' | 'signature' | 'all' = 'all';

    if (['header', 'payload', 'signature'].includes(parseJwtFlag)) {
        parseJwtPart = parseJwtFlag as
            | 'header'
            | 'payload'
            | 'signature'
            | 'all';
    }

    const graph = Graph(
        this.extensions.vault,
        key,
        credentials.auth,
        credentials.isDelegated,
        this.helpers.getFlag('v', 'graph-version')?.toString() === 'beta'
            ? 'beta'
            : 'v1.0'
    );

    const accessToken = await graph.getAccessToken();

    if (parseJwt) {
        const header = jwtDecode(accessToken, { header: true });
        const payload = jwtDecode(accessToken);
        const signature = accessToken.split('.')[2];

        if (jsonOutput) {
            switch (parseJwtPart) {
                case 'header':
                    return this.extensions.json.format(header);
                case 'payload':
                    return this.extensions.json.format(payload);
                case 'signature':
                    return this.extensions.json.format(signature);
                default:
                    return this.extensions.json.format({
                        header,
                        payload,
                        signature
                    });
            }
        }

        switch (parseJwtPart) {
            case 'header':
                return this.logger.format.json(header);
            case 'payload':
                return this.logger.format.json(payload);
            case 'signature':
                return signature;
            default:
                return `${this.logger.colors.greenBright('[HEADER]')}
${this.logger.format.json(header)}

${this.logger.colors.yellowBright('[PAYLOAD]')}
${this.logger.format.json(payload)}

${this.logger.colors.redBright('[SIGNATURE]')}

${signature}`;
        }
    }

    if (jsonOutput) return this.extensions.json.format({ accessToken });

    return accessToken;
});
