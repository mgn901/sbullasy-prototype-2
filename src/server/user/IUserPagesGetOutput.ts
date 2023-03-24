import { TPageForPublic } from '../page/TPageForPublic';
import { IUser } from './IUser';

export interface IUserPagesGetOutput {
	id: IUser['id'];
	pages: TPageForPublic[];
}
