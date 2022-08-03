import GraphInterface from 'graph-interface';
import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';

import { Credentials } from 'graph-interface/lib/interfaces';
import { CommandInternal } from '@giancarl021/cli-core/interfaces';

import hash from '../util/hash';

export default function (commandInternal: CommandInternal, credentials: Credentials, isDelegated: boolean, version?: string) {
    const credentialsHash = hash(`${credentials.clientId}-${credentials.clientSecret}-${credentials.tenantId}::${isDelegated}`);

    const graph = GraphInterface(credentials, {
        authenticationProvider: isDelegated ? GraphInterfaceDesktopProvider({}) : undefined,
        version
    });

    return graph;
}