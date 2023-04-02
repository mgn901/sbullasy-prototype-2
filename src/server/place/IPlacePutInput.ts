import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { IPlace } from './IPlace';

export interface IPlacePutInput {
	apiToken: IAPIToken['token'];
	sessionID: ISession['id'];
	place: EntityWithoutEntityKey<IPlace>;
}
