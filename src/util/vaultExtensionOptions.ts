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
    dataPath: '~/.gph-cli/vars.json'
} as VaultExtensionOptions;
