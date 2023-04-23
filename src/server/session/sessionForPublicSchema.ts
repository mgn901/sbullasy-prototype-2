import { Type } from '@fastify/type-provider-typebox';

export const sessionForPublicSchema = Type.Object({
	name: Type.String(),
	ipAddress: Type.String(),
	loggedInAt: Type.Number(),
});
