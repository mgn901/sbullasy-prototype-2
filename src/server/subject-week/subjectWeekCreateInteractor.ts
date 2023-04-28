import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekCreateInput } from './ISubjectWeekCreateInput';
import { ISubjectWeekCreateOutput } from './ISubjectWeekCreateOutput';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

interface ISubjectWeekCreateInteractorParams extends IInteractorParams<
	ISubjectWeekRepository,
	ISubjectWeekCreateInput,
	ISubjectWeek
> {
	userRepository: IUserRepository;
}

export const subjectWeekCreateInteractor = async (params: ISubjectWeekCreateInteractorParams): Promise<ISubjectWeekCreateOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, subjectWeek } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			permissionNeeded: 'subject-week_write',
			userRepository: userRepository,
		});
		if (!(verifyAPITokenResult.status)) {
			throw verifyAPITokenResult.error;
		}

	} else if (sessionID) {
		const verifySessionResult = await verifySession({
			sessionID: sessionID,
			userRepository: userRepository,
		});
		if (!(verifySessionResult.status)) {
			throw verifySessionResult.error;
		}

		const user = verifySessionResult.user;
		const verifyUserTagResult = await verifyUserTag({
			userID: user.id,
			tagNeeded: 'subject-week_write',
			userRepository: userRepository,
		});
		if (!(verifyUserTagResult.status)) {
			throw verifyUserTagResult.error;
		}

	} else {
		const error = new WrongParamsError({
			message: 'You have no credentials for the operation.',
		});
		throw error;
	}

	const id = generateID();
	const subjectWeekSaved = { id, ...subjectWeek };
	await repository.save(subjectWeekSaved);

	const output: ISubjectWeekCreateOutput = {
		subjectWeek: subjectWeekSaved,
	};

	return output;
}
