import Crypto from 'crypto';

/**
 * Generate 96bit ID and return as 16 characters,
 * @returns generated id in `string`
 */
export const generateId = (): string => {
  const buffer = Crypto.randomBytes(12);
  const string = buffer.toString('base64url');
  return string;
};
