import { IAPIToken } from '../api-token/IAPIToken';
import { ISession } from '../session/ISession';
import { IPlace } from './IPlace';

export interface IPlaceDeleteInput {
	apiToken?: IAPIToken['token'];
	sessionID?: ISession['id'];
	id: IPlace['id'];
}
