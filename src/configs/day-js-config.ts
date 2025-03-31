import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeekday from 'dayjs/plugin/isoWeek';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekDay from 'dayjs/plugin/weekday';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(isoWeekday);
dayjs.extend(timezone);
dayjs.extend(weekDay);
dayjs.extend(minMax);

export default dayjs;
