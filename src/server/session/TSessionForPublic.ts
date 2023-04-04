import { TEntityWithoutEntityKey } from '../TEntityWithoutEntityKey';
import { ISession } from './ISession';

export type TSessionForPublic = Pick<TEntityWithoutEntityKey<ISession>, 'name' | 'ipAddress' | 'loggedInAt'>;
