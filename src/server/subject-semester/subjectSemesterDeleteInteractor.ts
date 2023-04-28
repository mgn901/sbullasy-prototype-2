import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectSemester } from './ISubjectSemester';
import { ISubjectSemesterDeleteInput } from './ISubjectSemesterDeleteInput';
import { ISubjectSemesterDeleteOutput } from './ISubjectSemesterDeleteOutput';
import { ISubjectSemesterRepository } from './ISubjectSemesterRepository';

interface ISubjectSemesterDeleteInteractorParams extends IInteractorParams<
	ISubjectSemesterRepository,
	ISubjectSemesterDeleteInput,
	ISubjectSemester
> {
	userRepository: IUserRepository;
}

export const subjectSemesterDeleteInteractor = async (params: ISubjectSemesterDeleteInteractorParams): Promise<ISubjectSemesterDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, id } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			permissionNeeded: 'subject-semester_write',
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
			tagNeeded: 'subject-category_write',
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

	await repository.deleteByID(id);

	const output: ISubjectSemesterDeleteOutput = {};

	return output;
}
