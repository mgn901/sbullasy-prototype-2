import { IInteractorParams } from '../IInteractorParams';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ITeacher } from './ITeacher';
import { ITeacherCreateInput } from './ITeacherCreateInput';
import { ITeacherCreateOutput } from './ITeacherCreateOutput';
import { ITeacherRepository } from './ITeacherRepository';

interface ITeacherCreateInteractorParams extends IInteractorParams<
	ITeacherRepository,
	ITeacherCreateInput,
	ITeacher
> {
	userRepository: IUserRepository;
}

export const teacherCreateInteractor = async (params: ITeacherCreateInteractorParams): Promise<ITeacherCreateOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, teacher } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			userRepository: userRepository,
			permissionNeeded: 'teacher_write',
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
			userRepository: userRepository,
			tagNeeded: 'teacher_write',
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
	const teacherSaved = { id, ...teacher };
	await repository.save(teacherSaved);

	const output: ITeacherCreateOutput = {
		teacher: teacherSaved,
	};

	return output;
}
