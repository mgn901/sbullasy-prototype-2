import { IUser } from '../user/IUser';

export type IAPITokenPermission = 'place_write'
	| 'subject_write'
	| 'subject-category_write'
	| 'subject-semester_write'
	| 'subject-week_write'
	| 'teacher_write';

export interface IAPIToken {
	readonly id: string;
	readonly user: IUser;
	readonly token: string;
	readonly createdAt: number;
	readonly permission: IAPITokenPermission[];
}
