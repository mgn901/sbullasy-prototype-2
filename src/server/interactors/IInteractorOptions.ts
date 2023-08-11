import { IEmailClient } from '../email-client/IEmailClient.ts';
import { IToken } from '../models/interfaces';
import { IRepository } from '../repositories/IRepository';

export interface IInteractorOptions<Q extends {}> {
  repository: IRepository;
  emailClient: IEmailClient;
  query: Q;
  tokenFromClient?: {
    tokenType: 'bearer' | 'cookie';
    tokenId: IToken['id'];
  };
}
