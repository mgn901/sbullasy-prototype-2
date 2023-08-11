import { IToken } from '../models/interfaces';
import { IRepository } from '../repositories/IRepository';

export interface IInteractorOptions<Q extends {}> {
  repository: IRepository;
  query: Q;
  tokenFromClient?: {
    tokenType: 'bearer' | 'cookie';
    tokenId: IToken['id'];
  };
}
