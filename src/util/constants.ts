export default {
    graph: {
        version: 'v1.0'
    },
    cli: {
        asString(data: object) {
            return JSON.stringify(data, null, 2);
        } 
    }
}