import { EmailAlreadyInUseError } from '../error/EmailAlreadyInUseError';
import { IUserRepository } from '../user/IUserRepository';

interface IIsEmailNotInUseParams {
	email: string;
	userRepository: IUserRepository;
}

type TIsEmailNotInUseResult = {
	status: true;
	error: undefined;
} | {
	status: false;
	error: EmailAlreadyInUseError;
}

export const isEmailNotInUse = async (params: IIsEmailNotInUseParams): Promise<TIsEmailNotInUseResult> => {
	const { email, userRepository } = params;
	const user = await userRepository.findByEmail(email);

	if (!user) {
		const result: TIsEmailNotInUseResult = {
			status: true,
			error: undefined,
		};
		return result;
	}

	const error = new EmailAlreadyInUseError({
		message: '"email" is already used by other user.',
	});
	const result: TIsEmailNotInUseResult = {
		status: false,
		error: error,
	};

	return result;
}
