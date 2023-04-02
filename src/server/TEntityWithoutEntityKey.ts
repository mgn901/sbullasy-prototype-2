import { TEntity } from './TEntity';

type TEntityWithoutEntityKeyBase<Interface extends TEntity> = {
	[K in keyof Interface]: NonNullable<Interface[K]> extends TEntity
	? NonNullable<Interface[K]>['id']
	: NonNullable<Interface[K]> extends TEntity[]
	? never
	: NonNullable<Interface[K]>;
};

export type EntityWithoutEntityKey<Interface extends TEntity> = Pick<
	TEntityWithoutEntityKeyBase<Interface>,
	Extract<
		keyof TEntityWithoutEntityKeyBase<Interface>,
		{ [K in keyof TEntityWithoutEntityKeyBase<Interface>]: TEntityWithoutEntityKeyBase<Interface>[K] extends never
			? never
			: K;
		}[keyof TEntityWithoutEntityKeyBase<Interface>]
	>
>;
