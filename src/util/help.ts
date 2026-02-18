import {
    defineMultiCommandHelpDescriptor,
    type HelpDescriptor
} from '@giancarl021/cli-core';

const commonFlags: HelpDescriptor['flags'] = {
    json: {
        description: 'Output the result in JSON format',
        optional: true
    }
};

export default defineMultiCommandHelpDescriptor({
    token: {
        description: 'Get the access token for a specific credential',
        flags: {
            ...commonFlags,
            'parse-jwt': {
                description:
                    'Parse the JWT access token and display the specified part. By default, all parts are shown.',
                optional: true,
                values: ['header', 'payload', 'signature', 'all']
            }
        }
    }
});
