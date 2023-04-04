import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from '../session/ISession';
import { IUserTag } from './IUserTag';

export interface IUserTagPutInput {
	sessionID: ISession['id'];
	tag: TEntityWithoutEntityKey<IUserTag>;
}
