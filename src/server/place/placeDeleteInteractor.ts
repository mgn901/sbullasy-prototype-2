import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IPlace } from './IPlace';
import { IPlaceDeleteInput } from './IPlaceDeleteInput';
import { IPlaceDeleteOutput } from './IPlaceDeleteOutput';
import { IPlaceRepository } from './IPlaceRepository';

interface IPlaceDeleteInteractorParams extends IInteractorParams<
	IPlaceRepository,
	IPlaceDeleteInput,
	IPlace
> {
	userRepository: IUserRepository;
}

export const placeDeleteInteractor = async (params: IPlaceDeleteInteractorParams): Promise<IPlaceDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, id } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			userRepository: userRepository,
			permissionNeeded: 'place_write',
		});
		if (!verifyAPITokenResult.status) {
			throw verifyAPITokenResult.error;
		}

	} else if (sessionID) {
		const verifySessionResult = await verifySession({
			sessionID: sessionID,
			userRepository: userRepository,
		});
		if (!verifySessionResult.status) {
			throw verifySessionResult.error;
		}

		const user = verifySessionResult.user;
		const verifyUserTagResult = await verifyUserTag({
			userID: user.id,
			userRepository: userRepository,
			tagNeeded: 'place_write',
		});
		if (!verifyUserTagResult.status) {
			throw verifyUserTagResult.error;
		}

	} else {
		const error = new WrongParamsError({
			message: 'You have no credentials for the operation.',
		});
		throw error;
	}

	await repository.deleteByID(id);

	const output: IPlaceDeleteOutput = {};

	return output;
}
