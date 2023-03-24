import Crypto from 'crypto';

/**
 * Generate 192bit ID and return as 32 characters,
 * @returns generated id in `string`
 */
export const generateID = (): string => {
	const buffer = Crypto.randomBytes(24);
	const string = buffer.toString('base64url');
	return string;
}
