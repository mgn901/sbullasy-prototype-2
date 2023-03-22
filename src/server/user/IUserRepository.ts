import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { IUser } from './IUser';

export type IUserRepository = IRepository<IUser> & {
	findByEmail(email: IUser['email']): Promise<EntityAsync<IUser>>;
};
