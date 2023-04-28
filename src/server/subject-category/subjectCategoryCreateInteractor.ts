import { WrongParamsError } from '../error/WrongParamsError';
import { IInteractorParams } from '../IInteractorParams';
import { IUserRepository } from '../user/IUserRepository';
import { generateID } from '../utils/generateID.node';
import { verifyAPIToken } from '../utils/verifyAPIToken';
import { verifySession } from '../utils/verifySession';
import { verifyUserTag } from '../utils/verifyUserTag';
import { ISubjectCategory } from './ISubjectCategory';
import { ISubjectCategoryCreateInput } from './ISubjectCategoryCreateInput';
import { ISubjectCategoryCreateOutput } from './ISubjectCategoryCreateOutput';
import { ISubjectCategoryRepository } from './ISubjectCategoryRepository';

interface ISubjectCategoryCreateInteractorParams extends IInteractorParams<
	ISubjectCategoryRepository,
	ISubjectCategoryCreateInput,
	ISubjectCategory
> {
	userRepository: IUserRepository;
}

export const subjectCategoryCreateInteractor = async (params: ISubjectCategoryCreateInteractorParams): Promise<ISubjectCategoryCreateOutput> => {
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

	const id = generateID();
	const subjectCategorySaved = { id, ...subjectCategory };
	await repository.save(subjectCategorySaved);

	const output: ISubjectCategoryCreateOutput = {
		subjectCategory: subjectCategorySaved,
	};

	return output;
}
