import React, { FC } from 'react';
import { envs } from '../env/envs';
import { PageRoot } from './PageRoot';

interface IIndexHTMLRootProps {
	path: string;
	siteTitle: string;
	pageTitle: string;
	description: string;
}

export const IndexHTMLRoot: FC<IIndexHTMLRootProps> = (props) => {
	return <PageRoot
		scheme={envs.SBULLASY_APP_SCHEME}
		host={envs.SBULLASY_APP_HOST}
		path={props.path}
		siteTitle={props.siteTitle}
		pageTitle={props.pageTitle}
		description={props.description}
		ogImagePath='/assets/icons/512.png'
	>
		<div id='app'></div>
	</PageRoot>;
}
