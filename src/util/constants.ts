export default {
    graph: {
        version: 'v1.0'
    },
    template: {
        availableCommands: [
            'unit',
            'list',
            'massive'
        ]
    },
    cli: {
        asString(data: object) {
            return JSON.stringify(data, null, 2);
        }
    }
}