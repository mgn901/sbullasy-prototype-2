import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { IUserTagRequest } from './IUserTagRequest';

export type IUserTagRequestRepository = IRepository<IUserTagRequest> & {
	findByToken(token: IUserTagRequest['token']): Promise<EntityAsync<IUserTagRequest>>;
};
