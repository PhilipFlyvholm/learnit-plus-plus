type Timeslot = { from: number; to_h: number; to_m: number } | null;
enum Weekdays {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}
function getOpeningHours(): Map<number, Timeslot> {
  // from 8 to 15:30
  const normalOperation: Timeslot = { from: 8, to_h: 15, to_m: 30 };
  const shortDayOperation: Timeslot = { from: 8, to_h: 13, to_m: 30 };
  const closed: Timeslot = null;
  return new Map([
    [Weekdays.MONDAY, normalOperation],
    [Weekdays.TUESDAY, normalOperation],
    [Weekdays.WEDNESDAY, normalOperation],
    [Weekdays.THURSDAY, normalOperation],
    [Weekdays.FRIDAY, shortDayOperation],
    [Weekdays.SATURDAY, closed],
    [Weekdays.SUNDAY, closed],
  ]);
}

export function getTodaysOpeningHours(): Timeslot {
  const openingHours = getOpeningHours();
  const today = new Date().getDay()-1;
  
  return openingHours.get(today) ?? null;
}
