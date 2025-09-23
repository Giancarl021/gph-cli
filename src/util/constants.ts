export default {
    credentials: {
        regex: /^[a-zA-Z0-9-_]+$/,
        reservedKeys: ['default'] as string[]
    },
    graph: {
        defaultVersion: 'v1.0'
    },
    template: {
        availableCommands: ['unit', 'list', 'massive']
    },
    cli: {
        asString(data: object) {
            return JSON.stringify(data, null, 2);
        }
    }
} as const;
