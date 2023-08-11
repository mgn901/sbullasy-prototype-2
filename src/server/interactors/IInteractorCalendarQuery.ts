export interface IInteractorCalendarQuery {
  limit?: number;
  offset?: number;
  cursor?: string;
  calendarKey: string;
  calendarBefore?: number;
  calendarAfter?: number;
}
