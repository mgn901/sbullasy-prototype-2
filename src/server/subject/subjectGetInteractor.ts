import { NotFoundError } from '../error/NotFoundError';
import { IInteractorParams } from '../IInteractorParams';
import { ISubject } from './ISubject';
import { ISubjectGetInput } from './ISubjectGetInput';
import { ISubjectGetOutput } from './ISubjectGetOutput';
import { ISubjectRepository } from './ISubjectRepository';
import { subjectToSubjectForPublic } from './subjectToSubjectForPublic';

interface ISubjectGetInteractorParams extends IInteractorParams<
	ISubjectRepository,
	ISubjectGetInput,
	ISubject
> { }

export const subjectGetInteractor = async (params: ISubjectGetInteractorParams): Promise<ISubjectGetOutput> => {
	const { repository, input } = params;

	const subject = await repository.findByID(input.subjectID);

	if (!subject) {
		const error = new NotFoundError({
			message: `The subject (subjectID: ${input.subjectID}) is not found.`,
		});
		throw error;
	}
	const subjectForPublic = await subjectToSubjectForPublic(subject);

	const output: ISubjectGetOutput = {
		subject: subjectForPublic,
	};

	return output;
}
