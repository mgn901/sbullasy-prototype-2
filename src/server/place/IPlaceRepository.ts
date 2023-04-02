import { TEntityAsync } from '../TEntityAsync';
import { IRepository } from '../IRepository';
import { IPlace } from './IPlace';

export type IPlaceRepository = IRepository<IPlace> & {
	findAll(): Promise<TEntityAsync<IPlace>[]>;
};
