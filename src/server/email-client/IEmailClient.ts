import { IEmail } from './IEmail';

export interface IEmailClient {
  send(email: IEmail): Promise<void>;
}
