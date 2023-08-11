import { IEmail } from '../../email-client/IEmail.ts';

export const createEmailForLogin = (to: string, secret: string): IEmail => ({
  to,
  subject: `スバラシのログイン用コード: ${secret}`,
  body: `スバラシをご利用くださいまして、ありがとうございます。

このメールが届いたメールアドレスで、スバラシに「ログイン」しようとしています。
ログインする場合は、スバラシのコード入力欄に次のコードを入力してください。

コード: ${secret}

ログインしようとした覚えがない場合は、このメールを破棄してください。

====================
スバラシ
====================
`,
});
