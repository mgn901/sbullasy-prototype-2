import { EntityAsync } from '../EntityAsync';
import { IRepository } from '../IRepository';
import { IPlace } from './IPlace';

export type IPlaceRepository = IRepository<IPlace> & {
	findAll(): Promise<EntityAsync<IPlace>[]>;
};
