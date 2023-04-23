import { dateToUnixTimeMillis } from '@mgn901/mgn901-utils-ts';
import { IInteractorParams } from '../IInteractorParams';
import { IUserTag } from '../user-tag/IUserTag';
import { IUserTagGrantability } from '../user-tag/IUserTagGrantability';
import { IUserTagRepository } from '../user-tag/IUserTagRepository';
import { IUser } from '../user/IUser';
import { IUserRepository } from '../user/IUserRepository';
import { IUserTagRegistration } from '../user/IUserTagRegistration';
import { generateID } from '../utils/generateID.node';
import { IStartInput } from './IStartInput';
import { IStartOutput } from './IStartOutput';

interface IStartInteractorParams extends IInteractorParams<
	IUserRepository,
	IStartInput,
	IUser
> {
	userTagRepository: IUserTagRepository;
}

export const startInteractor = async (params: IStartInteractorParams): Promise<IStartOutput> => {
	const { repository, input, userTagRepository } = params;
	const userPartial = input.user;

	// Check whether admin user exists.
	const adminUserInDB = await repository.findByID('admin');
	if (adminUserInDB) {
		return {};
	}

	// If not, admin user will be created.
	const adminUserTag: IUserTag = {
		id: 'admin',
		name: 'admin',
		displayName: '管理者',
		grantableBy: [],
	};
	const adminUserTagGrantability: IUserTagGrantability = {
		id: generateID(),
		tag: adminUserTag,
		grantableByUserTag: adminUserTag,
	};
	adminUserTag.grantableBy.push(adminUserTagGrantability);
	await userTagRepository.save(adminUserTag);

	const now = dateToUnixTimeMillis(new Date());
	const adminUser: IUser = {
		id: 'admin',
		email: userPartial.email,
		displayName: userPartial.displayName,
		createdAt: now,
		ipAddress: '',
		sessions: [],
		createSessionRequests: [],
		apiTokens: [],
		tagRegistrations: [],
		properties: [],
		pages: [],
		owns: [],
		belongs: [],
		watchesGroups: [],
		watchesPages: [],
	};
	const adminUserTagRegistration: IUserTagRegistration = {
		id: generateID(),
		tag: adminUserTag,
		user: adminUser,
	};
	adminUser.tagRegistrations.push(adminUserTagRegistration);
	await repository.save(adminUser);

	const output: IStartOutput = {};

	return output;
}
