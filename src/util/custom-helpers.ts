import { CommandHelpers, GetFlagHelper, WhichFlagHelper, Flags } from '@giancarl021/cli-core/interfaces';

export default function (args: string[], flags: Flags): CommandHelpers {
    function getFlag(flagName: string, ...aliases: string[]) {
        const arr = [flagName, ...aliases];

        const n = arr.find(n => flags.hasOwnProperty(n));

        if (typeof n === 'undefined') return n;
        
        return flags[n];
    }

    function hasFlag(flagName: string, ...aliases: string[]) {
        const arr = [flagName, ...aliases];

        return arr.some(n => flags.hasOwnProperty(n));
    }

    function whichFlag(flagName: string, ...aliases: string[]) {
        const arr = [flagName, ...aliases];

        const n = arr.find(n => flags.hasOwnProperty(n));

        return n;
    }

    function valueOrDefault(value: any, defaultValue: any) {
        if (value === null || value === undefined) {
            return defaultValue;
        }

        return value;
    }

    function getArgAt(index: number) {
        return args[index];
    }

    function hasArgAt(index: number) {
        return args.length > index;
    }

    function cloneArgs() {
        return [...args];
    } 

    return {
        getFlag: getFlag as GetFlagHelper,
        hasFlag,
        whichFlag: whichFlag as WhichFlagHelper,
        getArgAt,
        hasArgAt,
        cloneArgs,
        valueOrDefault
    };
}