import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

export default dayjs;
