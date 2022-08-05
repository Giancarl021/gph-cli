import { VaultExtensionOptions } from '@giancarl021/cli-core-vault-extension/interfaces';

const baseData = {
    cache: {},
    credentials: {
        default: null,
        keys: []
    }
};

export default {
    baseData,
    dataPath: '~/Documentos/Git/gph-cli/data/vars.json'
} as VaultExtensionOptions;
