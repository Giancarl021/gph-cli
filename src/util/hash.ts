import { createHash } from 'crypto';

/**
 * Hashes a given input string using SHA-256 and returns the hex encoded result.
 * @param input The input string to be hashed.
 * @returns The SHA-256 hash of the input string in hex encoding.
 */
export default function hash(input: string) {
    const hash = createHash('sha256').update(input).digest('hex');

    return hash;
}
