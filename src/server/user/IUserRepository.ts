import { IAPIToken } from '../api-token/IAPIToken';
import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export type IUserRepository = IRepository<IUser> & {
	findByEmail(email: IUser['email']): Promise<EntityAsync<IUser> | undefined>;
	findBySessionID(sessionID: ISession['id']): Promise<EntityAsync<IUser> | undefined>;
	findByAPIToken(token: IAPIToken['token']): Promise<EntityAsync<IUser> | undefined>;
};
