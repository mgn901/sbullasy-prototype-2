import { TPageForPublic } from '../page/TPageForPublic';
import { IUser } from './IUser';

export interface IUserWatchesPagesGetOutput {
	id: IUser['id'];
	watchesPages: TPageForPublic[];
}
