import { IEmail } from '../../email-client/IEmail.ts';

export const createEmailForVerification = (to: string, secret: string): IEmail => ({
  to,
  subject: `スバラシの学生認証用コード: ${secret}`,
  body: `スバラシをご利用くださいまして、ありがとうございます。

このメールが届いたメールアドレスで、スバラシの「学生認証」をしようとしています。
学生認証をする場合は、スバラシのコード入力欄に次のコードを入力してください。

コード: ${secret}

学生認証をしようとした覚えがない場合は、このメールを破棄してください。

====================
スバラシ
====================
`,
});
