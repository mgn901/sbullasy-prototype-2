import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlacePutOutput {
	place: EntityWithoutEntityKey<IPlace>;
}
