import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectCategory } from './ISubjectCategory';
import { ISubjectCategoryPutInput } from './ISubjectCategoryPutInput';
import { ISubjectCategoryPutOutput } from './ISubjectCategoryPutOutput';
import { ISubjectCategoryRepository } from './ISubjectCategoryRepository';

interface ISubjectCategoryPutInteractorParams extends IInteractorParams<
	ISubjectCategoryRepository,
	ISubjectCategoryPutInput,
	ISubjectCategory
> {
	userRepository: IUserRepository;
}

export const subjectCategoryPutInteractor = async (params: ISubjectCategoryPutInteractorParams): Promise<ISubjectCategoryPutOutput> => {
	const { repository, input, userRepository } = params;
	const { apiToken, sessionID, subjectCategory } = input;

	if (apiToken) {
		const verifyAPITokenResult = await verifyAPIToken({
			apiToken: apiToken,
			permissionNeeded: 'subject-category_write',
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

	await repository.save(subjectCategory);

	const output: ISubjectCategoryPutOutput = {
		subjectCategory: subjectCategory,
	};

	return output;
}
