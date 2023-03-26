import { Entity } from './Entity';

type PromiseOptional<T> = Promise<T> | T;

export type EntityAsync<Interface extends Entity> = {
	[K in keyof Interface]: Interface[K] extends Entity
	? PromiseOptional<EntityAsync<Interface[K]>>
	: Interface[K] extends Entity[]
	? PromiseOptional<EntityAsync<Interface[K][number]>[]>
	: Required<Interface>[K] extends Entity
	? PromiseOptional<EntityAsync<Required<Interface>[K]> | undefined>
	: Interface[K];
}
