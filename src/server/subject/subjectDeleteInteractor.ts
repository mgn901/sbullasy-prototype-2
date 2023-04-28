import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubject } from './ISubject';
import { ISubjectDeleteInput } from './ISubjectDeleteInput';
import { ISubjectDeleteOutput } from './ISubjectDeleteOutput';
import { ISubjectRepository } from './ISubjectRepository';

interface ISubjectDeleteInteractorParams extends IInteractorParams<
	ISubjectRepository,
	ISubjectDeleteInput,
	ISubject
> {
	userRepository: IUserRepository;
}

export const subjectDeleteInteractor = async (params: ISubjectDeleteInteractorParams): Promise<ISubjectDeleteOutput> => {
	const { repository, input, userRepository } = params;

	if (input.sessionID) {
		const verifySessionResult = await verifySession({
			sessionID: input.sessionID,
			userRepository: userRepository,
		});
		if (!(verifySessionResult.status)) {
			throw verifySessionResult.error;
		}

		const verifyUserTagResult = await verifyUserTag({
			userID: verifySessionResult.user.id,
			tagNeeded: 'subject_write',
			userRepository: userRepository,
		});
		if (!(verifyUserTagResult.status)) {
			throw verifyUserTagResult.error;
		}

	} else if (input.apiToken) {
		const verifycationResult = await verifyAPIToken({
			apiToken: input.apiToken,
			permissionNeeded: 'subject_write',
			userRepository: userRepository,
		});
		if (!(verifycationResult.status)) {
			throw verifycationResult.error;
		}

	} else {
		const error = new WrongParamsError({
			message: 'You have no credentials for the operation.',
		});
		throw error;
	}

	await repository.deleteByID(input.subjectID);

	const output: ISubjectDeleteOutput = {};

	return output;
}
