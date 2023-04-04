import { IInteractorParams } from '../IInteractorParams';
import { promisedMap } from '../utils/promisedMap';
import { IUserTag } from './IUserTag';
import { IUserTagGetAllInput } from './IUserTagGetAllInput';
import { IUserTagGetAllOutput } from './IUserTagGetAllOutput';
import { IUserTagRepository } from './IUserTagRepository';
import { userTagToUserTagForPublic } from './userTagToUserTagForPublic';

interface IUserTagGetAllInteractorParams extends IInteractorParams<
	IUserTagRepository,
	IUserTagGetAllInput,
	IUserTag
> { }

export const userTagGetAllInteractor = async (params: IUserTagGetAllInteractorParams): Promise<IUserTagGetAllOutput> => {
	const { repository, input } = params;

	const tags = await repository.findAll();
	const userTagsForOutput = await promisedMap(userTagToUserTagForPublic, tags);
	const output: IUserTagGetAllOutput = {
		tags: userTagsForOutput,
	};

	return output;
}
