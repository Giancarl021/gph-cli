import type { CliCoreExtension } from '@giancarl021/cli-core';
import stripAnsi from 'strip-ansi';

declare module '@giancarl021/cli-core' {
    export interface CliCoreCommandAddons {
        /**
         * JSON extension command addons
         */
        json: {
            /**
             * Formats data as a pretty JSON string without ANSI codes.
             * @param data The data to format
             * @returns The formatted JSON string
             */
            format<T>(data: T): string;
            /**
             * Checks if the `--json` flag was provided in the command input.
             * @returns `true` if the `--json` flag was provided, `false` otherwise
             */
            hasJsonOutput(): boolean;
        };
    }
}

/**
 * An extension that formats errors and outputs as JSON if the `--json` flag is present.
 * @returns The JSON output extension
 */
export default function JsonExtension(): CliCoreExtension {
    let hasJsonFlag = false;

    /**
     * Formats data as a pretty JSON string.
     * @param data The data to format
     * @returns The formatted JSON string
     */
    function _format<T>(data: T): string {
        return JSON.stringify(data, null, 2);
    }

    /**
     * Checks if a string is valid JSON.
     * @param data The string to check
     * @returns `true` if the string is valid JSON, `false` otherwise
     */
    function _isJson(data: string): boolean {
        try {
            JSON.parse(data);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * The JSON output extension
     */
    return {
        name: 'json',
        buildCommandAddons() {
            return {
                hasJsonOutput() {
                    return hasJsonFlag;
                },
                format: _format
            } as {};
        },
        interceptors: {
            beforeRouting(_, input) {
                for (const key in input.flags) {
                    if (key === 'json') {
                        hasJsonFlag = true;
                        break;
                    }
                }

                delete input.flags.json;

                return input;
            },
            beforeError(_, err) {
                if (!hasJsonFlag) return err;

                return new Error(_format({ error: stripAnsi(err.message) }));
            },
            beforePrinting(_, output) {
                if (
                    !hasJsonFlag ||
                    typeof output !== 'string' ||
                    _isJson(output)
                )
                    return output;

                return _format(stripAnsi(output));
            }
        }
    };
}
