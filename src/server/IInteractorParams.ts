import { TEntity } from './TEntity';
import { IRepository } from './IRepository';

export interface IInteractorParams<
	Repository extends IRepository<Interface>,
	Input extends {},
	Interface extends TEntity,
> {
	repository: Repository;
	input: Input;
}
