import { IInteractorCalendarQuery } from '../IInteractorCalendarQuery.ts';

export const convertCalendarQueryToSelectSubset = (query: IInteractorCalendarQuery) => ({
  attributes: {
    some: {
      key: query.calendarKey,
      valueNumber: {
        gt: 'calendarBefore' in query ? query.calendarBefore : undefined,
        lt: 'calendarAfter' in query ? query.calendarAfter : undefined,
      },
    },
  },
});
