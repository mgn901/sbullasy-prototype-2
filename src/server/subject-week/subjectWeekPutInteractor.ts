import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekPutInput } from './ISubjectWeekPutInput';
import { ISubjectWeekPutOutput } from './ISubjectWeekPutOutput';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

interface ISubjectWeekPutInteractorParams extends IInteractorParams<
	ISubjectWeekRepository,
	ISubjectWeekPutInput,
	ISubjectWeek
> {
	userRepository: IUserRepository;
}

export const subjectWeekPutInteractor = async (params: ISubjectWeekPutInteractorParams): Promise<ISubjectWeekPutOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, subjectWeek } = input;

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

	await repository.save(subjectWeek);

	const output: ISubjectWeekPutOutput = {
		subjectWeek: subjectWeek,
	};

	return output;
}
