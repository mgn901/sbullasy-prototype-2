import { EntityWithoutEntityKey } from '../EntityWithoutEntityKey';
import { IPlace } from './IPlace';

export interface IPlacePutOutput {
	place: EntityWithoutEntityKey<IPlace>;
}
