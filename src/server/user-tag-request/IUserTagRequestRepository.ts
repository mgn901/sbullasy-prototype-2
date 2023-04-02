import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from '../user/IUser';
import { IUserTagRequest } from './IUserTagRequest';

export type IUserTagRequestRepository = IRepository<IUserTagRequest> & {
	findByToken(token: IUserTagRequest['token']): Promise<TEntityAsync<IUserTagRequest> | undefined>;
	findByUserAndTag(user: IUser['id'], tag: IUserTag['id']): Promise<TEntityAsync<IUserTagRequest>[]>;
	deleteByUserAndTag(user: IUser['id'], tag: IUserTag['id']): Promise<void>;
};
