import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { NotFoundError } from '../error/NotFoundError';
import { RequestExpiredError } from '../error/RequestExpiredError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IResetPasswordRequestRepository } from '../reset-password-request/IResetPasswordRequestRepository';
import { hashPassword } from '../utils/hashPassword.argon2';
import { IUser } from './IUser';
import { IUserPasswordResetInput } from './IUserPasswordResetInput';
import { IUserPasswordResetOutput } from './IUserPasswordResetOutput';
import { IUserRepository } from './IUserRepository';

interface IUserPasswordResetInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserPasswordResetInput,
	IUser
> {
	requestRepository: IResetPasswordRequestRepository;
}

export const userPasswordResetInteractor = async (params: IUserPasswordResetInteractorParams): Promise<IUserPasswordResetOutput> => {
	const { repository, input, requestRepository } = params;

	const request = await requestRepository.findByID(input.id);
	if (!request) {
		const error = new NotFoundError({
			message: `The attached request (requestID: ${input.id}) is not found.`,
		});
		throw error;
	}
	const now = dateToUnixTimeMillis(new Date());

	if (request.email !== input.email) {
		const error = new WrongParamsError({
			message: '"email" is wrong',
		});
		throw error;
	}

	if (request.createdAt + 10 * 60 * 1000 < now) {
		const error = new RequestExpiredError({
			message: `The attached request (requestID: ${input.id}) is expired.`,
		});
		throw error;
	}

	const user = await repository.findByEmail(input.email);
	if (!user) {
		const error = new NotFoundError({
			message: `The user (email: ${input.email}) is not found.`,
		});
		throw error;
	}
	const hashedPassword = await hashPassword(input.password);
	user.password = hashedPassword;

	await repository.save(user);

	const output: IUserPasswordResetOutput = {};

	return output;
}
