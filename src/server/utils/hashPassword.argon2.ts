import argon2 from 'argon2';

/**
 * Hash password with argon2
 * @param password Raw password in `string`
 * @returns Hashed password in `string`
 */
export const hashPassword = async (password: string): Promise<string> => {
	return await argon2.hash(password);
}
