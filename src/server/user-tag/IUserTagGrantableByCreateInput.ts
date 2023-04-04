import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';

export interface IUserTagGrantableByCreateInput {
	sessionID: ISession['id'];
	userTagID: IUserTag['id'];
	userTagGrantability: TEntityWithoutEntityKey<IUserTagGrantability>;
}
