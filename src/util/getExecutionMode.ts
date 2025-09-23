export const ExecutionModes = {
    production: 0,
    debug: 1,
    trace: 2
} as const;

export type ExecutionMode = 0 | 1 | 2;

export default function getExecutionMode(): ExecutionMode {
    const debugEnv = Number(process.env.GPH_DEBUG);

    if (!debugEnv) {
        return ExecutionModes.production;
    }

    return debugEnv >= 2 ? ExecutionModes.trace : ExecutionModes.debug;
}
