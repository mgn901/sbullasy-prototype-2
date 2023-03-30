import { TSubjectForPublic } from './TSubjectForPublic';

export interface ISubjectGetAllOutput {
	subjects: Omit<TSubjectForPublic, 'properties'>[];
}
