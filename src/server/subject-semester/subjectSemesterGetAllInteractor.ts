import { IInteractorParams } from '../IInteractorParams';
import { ISubjectSemester } from './ISubjectSemester';
import { ISubjectSemesterGetAllInput } from './ISubjectSemesterGetAllInput';
import { ISubjectSemesterGetAllOutput } from './ISubjectSemesterGetAllOutput';
import { ISubjectSemesterRepository } from './ISubjectSemesterRepository';

interface ISubjectSemesterGetAllInteractorParams extends IInteractorParams<
	ISubjectSemesterRepository,
	ISubjectSemesterGetAllInput,
	ISubjectSemester
> { }

export const subjectSemesterGetAllInteractor = async (params: ISubjectSemesterGetAllInteractorParams): Promise<ISubjectSemesterGetAllOutput> => {
	const { repository, input } = params;

	const subjectSemesters = await repository.findAll();
	const output: ISubjectSemesterGetAllOutput = {
		subjectSemesters: subjectSemesters,
	};

	return output;
}
