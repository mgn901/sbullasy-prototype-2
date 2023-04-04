import { ISession } from '../session/ISession';
import { IUserTag } from './IUserTag';
import { IUserTagGrantability } from './IUserTagGrantability';

export interface IUserTagGrantableByDeleteInput {
	sessionID: ISession['id'];
	userTagID: IUserTag['id'];
	userTagGrantabilityID: IUserTagGrantability['id'];
}
