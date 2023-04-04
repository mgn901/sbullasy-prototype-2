import { TEntityAsync } from '../TEntityAsync';
import { ISession } from './ISession';
import { TSessionForPublic } from './TSessionForPublic';

export const sessionToSessionForPublic = (session: TEntityAsync<ISession>): TSessionForPublic => {
	const sessionForPublic: TSessionForPublic = {
		name: session.name,
		loggedInAt: session.loggedInAt,
		ipAddress: session.ipAddress,
	};
	return sessionForPublic;
}
