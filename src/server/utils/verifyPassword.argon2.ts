import argon2 from 'argon2';
import { NotFoundError } from '../error/NotFoundError';
import { SbullasyError } from '../error/SbullasyError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';

interface IVerifyPasswordParams {
	userID: string;
	password: string;
	userRepository: IUserRepository;
}

type TVerifyPasswordResult = {
	status: true;
	error: undefined;
} | {
	status: false;
	error: SbullasyError;
}

export const verifyPassword = async (params: IVerifyPasswordParams): Promise<TVerifyPasswordResult> => {
	const {userID, password, userRepository} = params;
	const user = await userRepository.findByID(userID);
	if (!user) {
		const error = new NotFoundError({
			message: `The user ${userID} is not found.`,
		});
		throw error;
	}

	const hashedPassword = user.password;
	const verifiedPassword = password;
	const match = await argon2.verify(hashedPassword, verifiedPassword);

	if (!match) {
		const error = new WrongParamsError({
			message: '"userID" or "password" is wrong.'
		});
		const result = {
			status: false as const,
			error: error,
		};
		return result;
	}

	const result = {
		status: true as const,
		error: undefined,
	};
	return result;
}
