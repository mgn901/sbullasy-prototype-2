import { Entity } from './Entity';

export type EntityAsync<Interface extends Entity> = {
	[K in keyof Interface]: Interface[K] extends Entity
	? Promise<EntityAsync<Interface[K]>>
	: Interface[K] extends Entity[]
	? Promise<EntityAsync<Interface[K][number]>[]>
	: Required<Interface>[K] extends Entity
	? Promise<EntityAsync<Required<Interface>[K]>>
	: Interface[K];
}
