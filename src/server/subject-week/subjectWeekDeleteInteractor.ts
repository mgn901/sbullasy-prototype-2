import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekDeleteInput } from './ISubjectWeekDeleteInput';
import { ISubjectWeekDeleteOutput } from './ISubjectWeekDeleteOutput';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

interface ISubjectWeekDeleteInteractorParams extends IInteractorParams<
	ISubjectWeekRepository,
	ISubjectWeekDeleteInput,
	ISubjectWeek
> {
	userRepository: IUserRepository;
}

export const subjectWeekDeleteInteractor = async (params: ISubjectWeekDeleteInteractorParams): Promise<ISubjectWeekDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const {apiToken, sessionID, id } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			permissionNeeded: 'subject-week_write',
			userRepository: userRepository,
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
			tagNeeded: 'subject-week_write',
			userRepository: userRepository,
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

	const output: ISubjectWeekDeleteOutput = {};

	return output;
}
