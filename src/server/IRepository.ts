import { TEntity } from './TEntity';
import { TEntityAsync } from './TEntityAsync';

export interface IRepository<Interface extends TEntity> {
	findByID(id: Interface['id']): Promise<TEntityAsync<Interface> | undefined>;
	findByIDs(...ids: Interface['id'][]): Promise<TEntityAsync<Interface>[]>;
	save(item: TEntityAsync<Interface> | Interface): Promise<void>;
	deleteByID(id: string): Promise<void>;
}
