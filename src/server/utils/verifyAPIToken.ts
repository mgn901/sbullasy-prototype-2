import { IAPIToken, IAPITokenPermission } from '../api-token/IAPIToken';
import { EntityAsync } from '../EntityAsync';
import { SbullasyError } from '../error/SbullasyError';
import { TokenInvalidError } from '../error/TokenInvalidError';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';

interface IVerifyAPITokenParams {
	apiToken: IAPIToken['token'];
	permissionNeeded: IAPITokenPermission;
	userRepository: IUserRepository;
}

type TVerifyAPITokenResult = {
	status: true;
	user: EntityAsync<IUser>;
	error: undefined;
} | {
	status: false;
	user: undefined;
	error: SbullasyError;
}

const createVerifyAPITokenErrorResult = (message: string): TVerifyAPITokenResult => {
	const error = new TokenInvalidError({
		message: message,
	});
	const result = {
		status: false as const,
		user: undefined,
		tokenObj: undefined,
		error: error,
	};
	return result;
}

export const verifyAPIToken = async (params: IVerifyAPITokenParams): Promise<TVerifyAPITokenResult> => {
	const { apiToken: token, userRepository, permissionNeeded } = params;
	const user = await userRepository.findByAPIToken(token);

	if (!user) {
		const result = createVerifyAPITokenErrorResult(`The token you've attached (tokenID: ${token}) is invalid.`);
		return result;
	}

	const apiTokens = await user.apiTokens;
	const tokenObj = apiTokens.find((tokenObj) => {
		return tokenObj.id === token;
	});

	if (!tokenObj) {
		const result = createVerifyAPITokenErrorResult(`The token you've attached (tokenID: ${token}) is invalid.`);
		return result;
	}

	const tokenObjIncludesPermission = tokenObj.permission.includes(permissionNeeded);

	if (!tokenObjIncludesPermission) {
		const result = createVerifyAPITokenErrorResult(`The token you've attached (tokenID: ${token}) does not have permission to perform the operation.`);
		return result;
	}

	const result = {
		status: true as const,
		user: user,
		tokenObj: tokenObj,
		error: undefined,
	};
	return result;
}
