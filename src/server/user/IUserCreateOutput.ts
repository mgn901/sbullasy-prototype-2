import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { TProperty } from '../property/TProperty';
import { ISession } from '../session/ISession';
import { IUserTag } from '../user-tag/IUserTag';
import { IUser } from './IUser';

export interface IUserCreateOutput {
	id: IUser['id'];
	email: IUser['email'];
	displayName: IUser['displayName'];
	sessionID: ISession['id'];
	tags: EntityWithoutEntityKey<IUserTag>[];
	properties: EntityWithoutEntityKey<TProperty>[];
}
