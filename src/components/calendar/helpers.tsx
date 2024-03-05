import { CalEvent } from "../../types";

export type CalBlock = ComputedCalEvent[][];

export interface ComputedCalEvent extends CalEvent {
  top: number;
  height: number;
}

/**
 * Parses the start and duration of calendar event, and convert them to px values
 * @param totalHeight the total height of the calendar div
 * @returns calendar event with computed properties top and height
 */
const preprocessEvent =
  (totalHeight: number, startingHour: number, endingHour: number) =>
  (event: CalEvent): ComputedCalEvent | null => {
    const [hours, minutes] = event.start.split(":").map((n) => parseInt(n, 10));

    if (hours < startingHour || hours > endingHour) {
      return null;
    }
    const totalHours = endingHour - startingHour;
    const start = hours - startingHour + minutes / 60;
    const top = (start * totalHeight) / totalHours;
    const height = (event.duration * totalHeight) / 60 / totalHours;
    return {
      ...event,
      top,
      height,
    };
  };

/**
 * @param sortedEvents the sorted list of calendar events by start time
 * @returns calendar events grouped by if they overlap
 */
const groupOverlapping = (
  sortedEvents: ComputedCalEvent[]
): ComputedCalEvent[][] => {
  const result: ComputedCalEvent[][] = [];
  let pos = 0;
  let currentGroup = [];

  let current = sortedEvents.shift();
  while (current) {
    if (!currentGroup.length) {
      pos = current.top + current.height;
      currentGroup.push(current);
      current = sortedEvents.shift();
    } else {
      if (current.top < pos) {
        pos = Math.max(pos, current.top + current.height);
        currentGroup.push(current);
        current = sortedEvents.shift();
      } else {
        result.push(currentGroup);
        currentGroup = [];
      }
    }
  }
  if (currentGroup.length) {
    result.push(currentGroup);
  }
  return result;
};

/**
 * Dispatch overlapping event to their own column inside a calendar block
 * @param group the computed cal events of a group
 * @returns different columns
 */
const groupToColumns = (group: ComputedCalEvent[]): CalBlock => {
  const columns: { pos: number; events: ComputedCalEvent[] }[] = [];
  let i = 0;

  let current = group.shift();
  while (current) {
    // find the first column that has enough space or create a new one
    for (i = 0; i < columns.length && columns[i].pos > current.top; i++) {}

    if (i < columns.length) {
      columns[i] = {
        events: [...columns[i].events, current],
        pos: current.top + current.height,
      };
    } else {
      columns.push({ pos: current.top + current.height, events: [current] });
    }

    current = group.shift();
  }

  return columns.map(({ events }) => events);
};

/**
 * group events by block and spread them on several columns if necessary
 * @param calEvents the calendar events
 * @param totalHeight the total height off the calendar div
 */
export const processCalEvents = (
  calEvents: CalEvent[],
  totalHeight: number,
  startingHour = 8,
  endingHour = 21
): CalBlock[] => {
  // preprocess events
  const sortedEvents = calEvents
    .map((e) => preprocessEvent(totalHeight, startingHour, endingHour)(e))
    .filter(Boolean) as ComputedCalEvent[];

  sortedEvents.sort((a, b) => a.top - b.top);

  if (sortedEvents.length === 1) {
    return [[[sortedEvents[0]]]];
  }

  // convert to groups, then split groups into columns
  return groupOverlapping(sortedEvents).map((g) => groupToColumns(g));
};
