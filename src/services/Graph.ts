import GraphInterface from 'graph-interface';
import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';
import VaultCache from './VaultCache';
import constants from '../util/constants';

import type { Credentials } from 'graph-interface/lib/interfaces';
import type VaultExtension from '../interfaces/VaultExtension';

export default function Graph(
    vault: VaultExtension,
    credentialsKey: string,
    credentials: Credentials,
    isDelegated: boolean,
    version: 'v1.0' | 'beta' = constants.graph.defaultVersion
) {
    const graph = GraphInterface(credentials, {
        authenticationProvider: isDelegated
            ? GraphInterfaceDesktopProvider({})
            : undefined,
        version,
        cacheService: VaultCache(vault, credentialsKey)
    });

    return graph;
}
