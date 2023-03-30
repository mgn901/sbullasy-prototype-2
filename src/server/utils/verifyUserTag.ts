import { PermissionError } from '../error/PermissionError';
import { SbullasyError } from '../error/SbullasyError';
import { WrongParamsError } from '../error/WrongParamsError';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';
import { promisedMap } from './promisedMap';

interface IVerifyUserTagParams {
	userID: IUser['id'];
	tagNeeded: IUserTag['id'];
	userRepository: IUserRepository;
}

type TVerifyUserTagResult = {
	status: true;
	error: undefined;
} | {
	status: false;
	error: SbullasyError;
}

export const verifyUserTag = async (params: IVerifyUserTagParams): Promise<TVerifyUserTagResult> => {
	const { userID, tagNeeded: permissionsNeeded, userRepository } = params;
	const user = await userRepository.findByID(userID);

	if (!user) {
		const error = new WrongParamsError({
			message: `The user (userID: ${userID}) is not found.`,
		});
		const result = {
			status: false as const,
			error: error,
		};
		return result;
	}

	const tagRegistrations = await user.tagRegistrations;
	const tagIDsUserHas = await promisedMap(async (registration) => {
		const tag = await registration.tag;
		const tagID = tag.id;
		return tagID;
	}, tagRegistrations);
	const hasTagNeeded = tagIDsUserHas.includes(permissionsNeeded);

	if (!hasTagNeeded) {
		const error = new PermissionError({
			message: `The user (userID: ${user.id}) does not have enough permission to perform the operation.`,
		});
		const result = {
			status: false as const,
			error: error,
		};
		return result;
	}

	const result = {
		status: true as const,
		error: undefined,
	};
	return result;
}
