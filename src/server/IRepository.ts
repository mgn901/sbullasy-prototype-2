import { Entity } from './Entity';
import { EntityAsync } from './EntityAsync';

export interface IRepository<Interface extends Entity> {
	findByIDs(...ids: Interface['id'][]): Promise<EntityAsync<Interface>[]>;
	save(item: EntityAsync<Interface> | Interface): Promise<void>;
	deleteByID(id: string): Promise<void>;
}
