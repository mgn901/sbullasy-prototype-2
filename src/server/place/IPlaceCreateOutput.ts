import { EntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceCreateOutput {
	place: EntityWithoutEntityKey<IPlace>;
}
