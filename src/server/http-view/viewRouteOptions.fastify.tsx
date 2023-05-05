import { Static, Type } from '@sinclair/typebox';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { envs } from '../env/envs';
import { IInfrastructures } from '../http-api/IInfrastructures';
import { TRouteOptionsWrapper } from '../http-api/TRouteOptionsWrapper.fastify';
import { ISubjectGetInput } from '../subject/ISubjectGetInput';
import { subjectGetInteractor } from '../subject/subjectGetInteractor';
import { IndexHTMLRoot } from './IndexHTMLRoot';
import { PageRoot } from './PageRoot';

const subjectViewParamsSchema = Type.Object({
	subjectID: Type.String(),
});

type TSubjectViewParamsSchema = Static<typeof subjectViewParamsSchema>;

export const rootViewRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{}> => ({
	method: 'GET',
	url: '/',
	handler: async (request, reply) => {
		const siteTitle = (await repositories.settingItemRepository.findByID('sbullasy.settings.page.siteTitle')).value;
		const description = (await repositories.settingItemRepository.findByID('sbullasy.settings.page.defaultDescription')).value;
		const rendered = renderToStaticMarkup(
			<IndexHTMLRoot
				path={request.routerPath}
				siteTitle={siteTitle}
				pageTitle='ホーム'
				description={description} />
		);
		await reply.status(200).send(rendered);
	},
})

export const subjectViewRouteOptions = (repositories: IInfrastructures): TRouteOptionsWrapper<{
	Params: TSubjectViewParamsSchema,
}> => ({
	method: 'GET',
	url: '/subjects/:subjectID',
	schema: {
		params: subjectViewParamsSchema,
	},
	handler: async (request, reply) => {
		const input: ISubjectGetInput = {
			subjectID: request.params.subjectID,
		};
		const output = await subjectGetInteractor({
			input: input,
			repository: repositories.subjectRepository,
		});
		const siteTitle = (await repositories.settingItemRepository.findByID('sbullasy.settings.page.siteTitle')).value;
		const description = (await repositories.settingItemRepository.findByID('sbullasy.settings.page.subjectDescription')).value;
		const rendered = renderToStaticMarkup(
			<PageRoot
				scheme={envs.SBULLASY_APP_SCHEME}
				host={envs.SBULLASY_APP_HOST}
				path={request.routerPath}
				siteTitle={siteTitle}
				pageTitle={`${output.subject.name} (${output.subject.classes.join(', ')} クラス)`}
				description={`${description} 「${output.subject.name}」 (${output.subject.classes.join(', ')} クラス) に関する情報を確認できます。`}
				ogImagePath='/assets/icons/512.png'
			>
				<div id='app'></div>
			</PageRoot>
		);
		const response = `<!DOCTYPE html>${rendered}`;
		await reply.status(200).send(response);
	},
})
