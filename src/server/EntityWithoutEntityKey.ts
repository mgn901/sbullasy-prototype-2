import { Entity } from './Entity';

type EntityWithoutEntityKeyBase<Interface extends Entity> = {
	[K in keyof Interface]: NonNullable<Interface[K]> extends Entity
	? NonNullable<Interface[K]>['id']
	: NonNullable<Interface[K]> extends Entity[]
	? never
	: NonNullable<Interface[K]>;
};

export type EntityWithoutEntityKey<Interface extends Entity> = Pick<
	EntityWithoutEntityKeyBase<Interface>,
	Extract<
		keyof EntityWithoutEntityKeyBase<Interface>,
		{ [K in keyof EntityWithoutEntityKeyBase<Interface>]: EntityWithoutEntityKeyBase<Interface>[K] extends never
			? never
			: K;
		}[keyof EntityWithoutEntityKeyBase<Interface>]
	>
>;
