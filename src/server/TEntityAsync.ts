import { TEntity } from './TEntity';

type PromiseOptional<T> = Promise<T> | T;

export type TEntityAsync<Interface extends TEntity> = {
	[K in keyof Interface]: Interface[K] extends TEntity
	? PromiseOptional<TEntityAsync<Interface[K]>>
	: Interface[K] extends TEntity[]
	? PromiseOptional<TEntityAsync<Interface[K][number]>[]>
	: Required<Interface>[K] extends TEntity
	? PromiseOptional<TEntityAsync<Required<Interface>[K]> | undefined>
	: Interface[K];
}
