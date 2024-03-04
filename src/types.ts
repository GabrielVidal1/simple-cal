export interface CalEvent {
  id: string;

  // in format 00:00 to 24:00
  start: string;

  // duration in minutes
  duration: number;
}