import { FastifyRequest } from 'fastify';
import { IInteractorOptions } from '../../interactors/IInteractorOptions.ts';

export const getTokenByRequest = (
  request: FastifyRequest,
): IInteractorOptions<{}>['tokenFromClient'] => {
  const cookieValue = request.cookies.token;
  if (cookieValue) {
    return { tokenType: 'cookie', tokenId: cookieValue };
  }
  const authorizationValue = request.headers.authorization;
  if (authorizationValue?.startsWith('Bearer ')) {
    return {
      tokenType: 'bearer',
      tokenId: authorizationValue.replace(/$Bearer\s+/g, ''),
    };
  }
  return undefined;
};
