import { envs } from '../env/envs';

export const defaultSettings = {
	'sbullasy.settings.templates.userCreateSubject': `【スバラシ】トークンをお送りいたします`,
	'sbullasy.settings.templates.userCreateBody': `スバラシをご利用くださいまして、ありがとうございます。

スバラシに <email> として ログイン しようとしています。
ログインする場合は、スバラシのトークン入力欄に次の文字列を入力してください。

トークン: <token>

ログインしようとした覚えがない場合は、このメールを破棄してください。

====================
スバラシ
${envs.SBULLASY_APP_SCHEME}://${envs.SBULLASY_APP_HOST}
====================
`,
	'sbullasy.settings.templates.createSessionRequestCreateSubject': `【スバラシ】トークンをお送りいたします`,
	'sbullasy.settings.templates.createSessionRequestCreateBody': `スバラシをご利用くださいまして、ありがとうございます。

スバラシに <email> として 新しいアカウントを作成 しようとしています。
作成する場合は、スバラシのトークン入力欄に次の文字列を入力してください。

トークン: <token>

（すでにスバラシのアカウントをお持ちの方へ）
スバラシは利用者のみなさまをメールアドレスで区別しています。
上記のコードを入力すると、現在お持ちのアカウントとは別の新しいアカウントが作成されます。
新しいアカウントの作成ではなく、現在お持ちのアカウントにログインしたい場合は、
このメールを破棄し、現在お持ちのアカウントを作成する際に使用したメールアドレスでお試しください。

アカウントを作成しようとした覚えがない場合は、このメールを破棄してください。

====================
スバラシ
${envs.SBULLASY_APP_SCHEME}://${envs.SBULLASY_APP_HOST}
====================
`,
};
