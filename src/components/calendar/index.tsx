import { useMemo } from "react";
import React from "react";

import useWindowDimensions from "./useWindowDimensions";
import { CalEvent } from "../../types";
import { processCalEvents } from "./helpers";

interface CalendarProps {
  events: CalEvent[];

  startingHour?: number;

  endingHour?: number;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  startingHour = 8,
  endingHour = 21,
}) => {
  const { width, height } = useWindowDimensions();

  const blocks = useMemo(
    () => processCalEvents(events, height, startingHour, endingHour),
    [events, height, startingHour, endingHour]
  );

  const stripeSize = height / (endingHour - startingHour);

  return (
    <div
      className="calendarGrid flex flex-col items-stretch w-full relative"
      style={{ height, width, backgroundSize: `10px ${stripeSize}px` }}
    >
      {blocks.map((block, i) => (
        <div key={i} className="flex w-full">
          {block.map((column, j) => (
            <div key={j} className="items-stretch flex-1">
              {column.map((event, k) => (
                <div
                  key={k}
                  className="bg-blue-500 border absolute flex items-center justify-center"
                  style={{ ...event, width: width / block.length }}
                >
                  {event.id}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
