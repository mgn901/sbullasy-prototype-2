import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectSemester } from './ISubjectSemester';
import { ISubjectSemesterCreateInput } from './ISubjectSemesterCreateInput';
import { ISubjectSemesterCreateOutput } from './ISubjectSemesterCreateOutput';
import { ISubjectSemesterRepository } from './ISubjectSemesterRepository';

interface ISubjectSemesterCreateInteractorParams extends IInteractorParams<
	ISubjectSemesterRepository,
	ISubjectSemesterCreateInput,
	ISubjectSemester
> {
	userRepository: IUserRepository;
}

export const subjectSemesterCreateInteractor = async (params: ISubjectSemesterCreateInteractorParams): Promise<ISubjectSemesterCreateOutput> => {
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

	const id = generateID();
	const subjectSemesterSaved = { id: id, ...subjectSemester };
	await repository.save(subjectSemesterSaved);

	const output: ISubjectSemesterCreateOutput = {
		subjectSemester: subjectSemesterSaved,
	};

	return output;
}
