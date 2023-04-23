import { SbullasyError } from '../error/SbullasyError';
import { TooManyRequestsError } from '../error/TooManyRequestsError';

type TAbleToResendEmailResult = {
	status: true,
	error: undefined,
} | {
	status: false,
	error: SbullasyError,
}

export const ableToResendEmail = (requestTimeList: number[], now: number): TAbleToResendEmailResult => {
	const _requestTimeList = [...requestTimeList].sort();
	const exeeded = (_requestTimeList.length === 2 && _requestTimeList[1] + 5 * 60 * 1000 > now)
		|| (_requestTimeList.length === 4 && _requestTimeList[3] + 20 * 60 * 1000 > now)
		|| (_requestTimeList.length === 6 && _requestTimeList[5] + 60 * 60 * 1000 > now)
		|| (_requestTimeList.length === 8 && _requestTimeList[7] + 180 * 60 * 1000 > now);

	if (exeeded) {
		const error = new TooManyRequestsError({
			message: 'You requested to send email for login too many times.',
		});
		const result: TAbleToResendEmailResult = {
			status: false,
			error: error,
		};
		return result;
	}

	const result: TAbleToResendEmailResult = {
		status: true,
		error: undefined,
	};
	return result;
}
