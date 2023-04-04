import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { IPlace } from './IPlace';

export interface IPlaceCreateInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	place: Omit<TEntityWithoutEntityKey<IPlace>, 'id'>;
}
