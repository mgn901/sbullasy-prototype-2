import { PermissionError } from '../error/PermissionError';
import { IInteractorParams } from '../IInteractorParams';
import { verifySession } from '../utils/verifySession';
import { IUser } from './IUser';
import { IUserDeleteInput } from './IUserDeleteInput';
import { IUserDeleteOutput } from './IUserDeleteOutput';
import { IUserRepository } from './IUserRepository';

export interface IUserDeleteInteractorParams extends IInteractorParams<
	IUserRepository,
	IUserDeleteInput,
	IUser
> { }

export const userDeleteInteractor = async (params: IUserDeleteInteractorParams): Promise<IUserDeleteOutput> => {
	const { repository, input } = params;
	const userID = input.userID;
	const sessionID = input.sessionID;

	const verifySessionResult = await verifySession({
		sessionID: sessionID,
		userRepository: repository,
	});
	if (!(verifySessionResult.status)) {
		throw verifySessionResult.error;
	}
	if (verifySessionResult.user.id !== input.userID) {
		const error = new PermissionError({
			message: `You are not allowed to delete the specified user (userID: ${userID}).`,
		});
		throw error;
	}

	await repository.deleteByID(userID);

	const output: IUserDeleteOutput = {};

	return output;
}
