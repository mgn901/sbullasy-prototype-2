import { Transporter, createTransport } from 'nodemailer';
import { IEmail } from './IEmail';
import { IEmailClient } from './IEmailClient';

export interface IEmailClientOptions {
	host: string;
	port: number;
	userEmail: string;
	password: string;
}

export class EmailClient implements IEmailClient {

	private readonly transporter: Transporter;
	private readonly userEmail: string;

	constructor(options: IEmailClientOptions) {
		this.userEmail = options.userEmail,
		this.transporter = createTransport({
			host: options.host,
			port: options.port,
			auth: {
				type: 'login',
				user: options.userEmail,
				pass: options.password,
			},
			secure: true,
		});
	}

	public async send(email: IEmail): Promise<void> {
		await this.transporter.sendMail({
			from: this.userEmail,
			to: email.to,
			subject: email.subject,
			text: email.body,
		});
	}

}
