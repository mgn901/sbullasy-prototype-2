import { IAPIToken } from '../api-token/IAPIToken';
import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export type IUserRepository = IRepository<IUser> & {
	findByEmail(email: IUser['email']): Promise<TEntityAsync<IUser> | undefined>;
	findBySessionID(sessionID: ISession['id']): Promise<TEntityAsync<IUser> | undefined>;
	findByAPIToken(token: IAPIToken['token']): Promise<TEntityAsync<IUser> | undefined>;
};
