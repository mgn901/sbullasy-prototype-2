import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IProperty } from '../property/IProperty';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserEditInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	displayName: string;
	properties: EntityWithoutEntityKey<IProperty>[];
}
