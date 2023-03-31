import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { IPlace } from './IPlace';

export interface IPlaceCreateInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	place: Omit<EntityWithoutEntityKey<IPlace>, 'id'>;
}
