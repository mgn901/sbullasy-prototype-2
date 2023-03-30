import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectSemester } from './ISubjectSemester';
import { ISubjectSemesterPutInput } from './ISubjectSemesterPutInput';
import { ISubjectSemesterPutOutput } from './ISubjectSemesterPutOutput';
import { ISubjectSemesterRepository } from './ISubjectSemesterRepository';

interface ISubjectSemesterPutInteractorParams extends IInteractorParams<
	ISubjectSemesterRepository,
	ISubjectSemesterPutInput,
	ISubjectSemester
> {
	userRepository: IUserRepository;
}

export const subjectSemesterPutInteractor = async (params: ISubjectSemesterPutInteractorParams): Promise<ISubjectSemesterPutOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, subjectSemester } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			permissionNeeded: 'subject-category_write',
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
			tagNeeded: 'subject-category_write',
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

	await repository.save(subjectSemester);

	const output: ISubjectSemesterPutOutput = {
		subjectSemester: subjectSemester,
	};

	return output;
}
