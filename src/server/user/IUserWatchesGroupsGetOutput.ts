import { TGroupForPublic } from '../group/TGroupForPublic';
import { IUser } from './IUser';

export interface IUserWatchesGroupsGetOutput {
	id: IUser['id'];
	watchesGroups: TGroupForPublic[];
}
