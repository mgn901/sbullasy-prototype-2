import React, { FC, ReactNode } from 'react';

interface IPageRootProps {
	scheme: string;
	host: string;
	path: string;
	siteTitle: string;
	pageTitle: string;
	description: string;
	ogImagePath: string;
	children: ReactNode | undefined;
}

export const PageRoot: FC<IPageRootProps> = (props) => {
	const url = new URL(props.path, `${props.scheme}://${props.host}`);
	const ogImageURL = new URL(props.ogImagePath, `${props.scheme}://${props.host}`);

	return <html lang='ja' prefix='og: https://ogp.me/ns#'>
		<head>
			<meta charSet='UTF-8' />
			<title>{props.pageTitle} - {props.siteTitle}</title>
			<meta name='viewport' content='width=device-width, initial-scale=1.0, viewport-fit=cover' />
			<meta name='description' content={props.description} />
			<meta property='og:site_name' content={props.siteTitle} />
			<meta property='og:title' content={props.pageTitle} />
			<meta property='og:description' content={props.description} />
			<meta property='og:url' content={url.toString()} />
			<meta property='og:type' content='website' />
			<meta property='og:image' content={ogImageURL.toString()} />
			<meta property='twitter:card' content='summary' />
			<link rel='manifest' href='/manifest.json' />
			<link rel='stylesheet' href='/index.css' />
			<link rel='icon' href='/assets/icons/favicon.ico' type='image/x-icon' />
			<link rel='apple-touch-icon' href='/assets/icons/icon-512x512.png' />
		</head>
		<body>
			{props.children}
			<script src='/index.js'></script>
		</body>
	</html>;
}
