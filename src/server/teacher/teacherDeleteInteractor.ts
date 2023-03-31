import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ITeacher } from './ITeacher';
import { ITeacherDeleteInput } from './ITeacherDeleteInput';
import { ITeacherDeleteOutput } from './ITeacherDeleteOutput';
import { ITeacherRepository } from './ITeacherRepository';

interface ITeacherDeleteInteractorParams extends IInteractorParams<
	ITeacherRepository,
	ITeacherDeleteInput,
	ITeacher
> {
	userRepository: IUserRepository;
}

export const teacherDeleteInteractor = async (params: ITeacherDeleteInteractorParams): Promise<ITeacherDeleteOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, id } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			userRepository: userRepository,
			permissionNeeded: 'teacher_write',
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
			tagNeeded: 'teacher_write',
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

	const output: ITeacherDeleteOutput = {};

	return output;
}
