import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlaceCreateOutput {
	place: EntityWithoutEntityKey<IPlace>;
}
