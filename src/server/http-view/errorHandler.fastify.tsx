import { FastifyInstance } from 'fastify';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SbullasyError } from '../error/SbullasyError';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { getStatusByError } from '../http-api/getStatusByError';
import { IndexHTMLRoot } from './IndexHTMLRoot';

export const createErrorHandler = (infrastructures: IInfrastructures): Parameters<FastifyInstance['setErrorHandler']>[0] => {
	return async (error, request, reply) => {
		const statusCode = error instanceof SbullasyError ? getStatusByError(error) : 500;
		try {
			const siteTitle = (await infrastructures.settingItemRepository.findByID('sbullasy.settings.page.siteTitle')).value;
			const rendered = renderToStaticMarkup(
				<IndexHTMLRoot
					path={request.routerPath}
					siteTitle={siteTitle}
					pageTitle='エラー'
					description='' />
			);
			await reply.status(statusCode).send(rendered);
		} catch {
			const rendered = renderToStaticMarkup(
				<IndexHTMLRoot
					path={request.routerPath}
					siteTitle=''
					pageTitle='エラー'
					description='' />
			);
			await reply.status(statusCode).send(rendered);
		}
	}
}
