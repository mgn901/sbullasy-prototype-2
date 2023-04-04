import { IUserTag } from './IUserTag';
import { TUserTagGrantabilityForPublic } from './TUserTagGrantabilityForPublic';

export interface IUserTagGrantableByCreateOutput {
	userTagID: IUserTag['id'];
	userTagGrantability: TUserTagGrantabilityForPublic;
}
