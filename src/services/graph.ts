import GraphInterface from 'graph-interface';
import { Credentials } from 'graph-interface/lib/interfaces';

import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';

export default function (credentials: Credentials, isDelegated: boolean, version?: string) {
    const graph = GraphInterface(credentials, {
        authenticationProvider: isDelegated ? GraphInterfaceDesktopProvider({}) : undefined,
        version
    });

    return graph;
}