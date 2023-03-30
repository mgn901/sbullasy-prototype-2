import { IInteractorParams } from '../IInteractorParams';
import { ISubjectCategory } from './ISubjectCategory';
import { ISubjectCategoryGetAllInput } from './ISubjectCategoryGetAllInput';
import { ISubjectCategoryGetAllOutput } from './ISubjectCategoryGetAllOutput';
import { ISubjectCategoryRepository } from './ISubjectCategoryRepository';

interface ISubjectCategoryGetAllInteractorParams extends IInteractorParams<
	ISubjectCategoryRepository,
	ISubjectCategoryGetAllInput,
	ISubjectCategory
> { }

export const subjectCategoryGetAllInteractor = async (params: ISubjectCategoryGetAllInteractorParams): Promise<ISubjectCategoryGetAllOutput> => {
	const { repository, input } = params;

	const subjectCategories = await repository.findAll();
	const output: ISubjectCategoryGetAllOutput = {
		subjectCategories: subjectCategories,
	};

	return output;
}
