import { Entity } from './Entity';
import { IRepository } from './IRepository';

export interface IInteractorParams<
	Repository extends IRepository<Interface>,
	Input extends {},
	Interface extends Entity,
> {
	repository: Repository;
	input: Input;
}
