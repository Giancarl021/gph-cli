import { VaultExtensionCallbacks } from '@giancarl021/cli-core-vault-extension/interfaces';

import { createHash } from 'crypto';

export default function (id?: string) {
    if (!id) id = 'default';

    const hash = createHash('md5')
        .update(id)
        .digest('base64');

    return `cache.${hash}`;
}