import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUser } from './IUser';

export interface IUserEditInput {
	sessionID: ISession['id'];
	userID: IUser['id'];
	displayName: string;
	properties: EntityWithoutEntityKey<TProperty>[];
}
