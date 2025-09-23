import readline from 'readline';
import CommandContext from '../interfaces/CommandContext';

type Helpers = CommandContext['helpers'];

/**
 * Prompts the user for input in the console.
 * @param message The message to display when prompting the user
 * @returns The user input
 */
export async function prompt(message: string): Promise<string> {
    let promptValue: string;

    do {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        promptValue = await new Promise<string>(resolve => {
            rl.question(`${message}: `, answer => {
                rl.close();
                resolve(answer);
            });
        });
    } while (!promptValue);

    return promptValue;
}

/**
 * Gets the value of a flag or prompts the user for input if the flag is not provided.
 * @param helpers The helpers object accessible from `this.helpers` in the command context
 * @param flagName The name of the flag to check
 * @param flagAliases Optional aliases for the flag
 * @param promptMessage Optional message to display when prompting the user. Defaults to the flag name.
 * @returns The value of the flag or the user input
 */
export async function flagOrPrompt(
    helpers: Helpers,
    flagName: string,
    flagAliases: string[] = [],
    promptMessage: string = flagName
): Promise<string> {
    const flagValue = helpers.getFlag(flagName, ...flagAliases);

    if (flagValue !== undefined) return String(flagValue);

    return await prompt(promptMessage);
}
