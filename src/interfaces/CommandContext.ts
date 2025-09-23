import type { CliCoreCommand } from '@giancarl021/cli-core';

type CommandContext = ThisParameterType<Extract<CliCoreCommand, Function>>;

export default CommandContext;
