import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { IUserTag } from './IUserTag';

export interface IUserTagCreateInput {
	sessionID: ISession['id'];
	tag: Pick<TEntityWithoutEntityKey<IUserTag>, 'name' | 'displayName'>;
}
