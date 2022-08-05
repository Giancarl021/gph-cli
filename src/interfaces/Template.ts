import { Flags } from '@giancarl021/cli-core/interfaces';

interface Template {
    command: string;
    credentialsId: string;
    flags: Flags;
    args: string[];
}

export default Template;