import { IInteractorParams } from '../IInteractorParams';
import { ISubjectWeek } from './ISubjectWeek';
import { ISubjectWeekGetAllInput } from './ISubjectWeekGetAllInput';
import { ISubjectWeekGetAllOutput } from './ISubjectWeekGetAllOutput';
import { ISubjectWeekRepository } from './ISubjectWeekRepository';

interface ISubjectWeekGetAllInteractorParams extends IInteractorParams<
	ISubjectWeekRepository,
	ISubjectWeekGetAllInput,
	ISubjectWeek
> { }

export const subjectWeekGetAllInteractor = async (params: ISubjectWeekGetAllInteractorParams): Promise<ISubjectWeekGetAllOutput> => {
	const { repository, input } = params;

	const subjectWeeks = await repository.findAll();

	const output: ISubjectWeekGetAllOutput = {
		subjectWeeks: subjectWeeks,
	};

	return output;
}
