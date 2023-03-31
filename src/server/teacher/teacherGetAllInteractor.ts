import { IInteractorParams } from '../IInteractorParams';
import { ITeacher } from './ITeacher';
import { ITeacherGetAllInput } from './ITeacherGetAllInput';
import { ITeacherGetAllOutput } from './ITeacherGetAllOutput';
import { ITeacherRepository } from './ITeacherRepository';

interface ITeacherGetAllInteractorParams extends IInteractorParams<
	ITeacherRepository,
	ITeacherGetAllInput,
	ITeacher
> { }

export const teacherGetAllInteractor = async (params: ITeacherGetAllInteractorParams): Promise<ITeacherGetAllOutput> => {
	const { repository, input } = params;

	const teachers = await repository.findAll();
	const output: ITeacherGetAllOutput = {
		teachers: teachers,
	};

	return output;
}
