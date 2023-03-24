import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from '../user/IUser';
import { IUserTagRequest } from './IUserTagRequest';

export type IUserTagRequestRepository = IRepository<IUserTagRequest> & {
	findByToken(token: IUserTagRequest['token']): Promise<EntityAsync<IUserTagRequest>>;
	findByUserAndTag(user: IUser['id'], tag: IUserTag['id']): Promise<EntityAsync<IUserTagRequest>[]>;
};
