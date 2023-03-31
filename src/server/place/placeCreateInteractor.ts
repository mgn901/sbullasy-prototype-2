import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { IPlace } from './IPlace';
import { IPlaceCreateInput } from './IPlaceCreateInput';
import { IPlaceCreateOutput } from './IPlaceCreateOutput';
import { IPlaceRepository } from './IPlaceRepository';

interface IPlaceCreateInteractorParams extends IInteractorParams<
	IPlaceRepository,
	IPlaceCreateInput,
	IPlace
> {
	userRepository: IUserRepository;
}

export const placeCreateInteractor = async (params: IPlaceCreateInteractorParams): Promise<IPlaceCreateOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, place } = input;

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

	const id = generateID();
	const placeSaved = { id, ...place };
	await repository.save(placeSaved);

	const output: IPlaceCreateOutput = {
		place: placeSaved,
	};

	return output;
}
