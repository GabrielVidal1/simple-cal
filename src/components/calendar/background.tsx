import useWindowDimensions from "./useWindowDimensions";

interface CalendarBackgroundProps {
  startingHour: number;
  endingHour: number;
}

export const CalendarBackground: React.FC<CalendarBackgroundProps> = ({
  startingHour,
  endingHour,
}) => {
  const { height } = useWindowDimensions();
  const totalHours = endingHour - startingHour;
  const hours = new Array(totalHours)
    .fill(0)
    .map((_, i) => `${i + startingHour}:00`);

  const stripeSize = height / (endingHour - startingHour);

  return (
    <div
      className="calendarGrid flex flex-col justify-stretch items-stretch "
      style={{ backgroundSize: `10px ${stripeSize}px` }}
    >
      {hours.map((hour, i) => (
        <div
          key={i}
          className="text-left text-sm pl-1 z-20 text-gray-700 font-bold"
          style={{ height: stripeSize }}
        >
          {hour}
        </div>
      ))}
    </div>
  );
};

export default CalendarBackground;
