import { IInteractorParams } from '../IInteractorParams';
import { promisedMap } from '../utils/promisedMap';
import { ISubject } from './ISubject';
import { ISubjectGetAllInput } from './ISubjectGetAllInput';
import { ISubjectGetAllOutput } from './ISubjectGetAllOutput';
import { ISubjectRepository } from './ISubjectRepository';
import { subjectToSubjectForPublicWithoutProperties } from './subjectToSubjectForPublicWithoutProperties';

interface ISubjectGetAllInteractorParams extends IInteractorParams<
	ISubjectRepository,
	ISubjectGetAllInput,
	ISubject
> { }

export const subjectGetAllInteractor = async (params: ISubjectGetAllInteractorParams): Promise<ISubjectGetAllOutput> => {
	const { repository, input } = params;

	const subjects = await repository.findAll();
	const subjectsForPublic = await promisedMap(subjectToSubjectForPublicWithoutProperties, subjects);

	const output: ISubjectGetAllOutput = {
		subjects: subjectsForPublic,
	};

	return output;
}
