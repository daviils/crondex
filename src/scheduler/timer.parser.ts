import { z } from 'zod';

export interface DailySchedule {
  hour: number;
  minute: number;
  value: string;
}

const scheduleSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Use o formato HH:mm.');

export function parseDailySchedule(schedule: string): DailySchedule {
  const value = scheduleSchema.parse(schedule);
  const [hourValue, minuteValue] = value.split(':');
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (hour < 0 || hour > 23) {
    throw new Error('Invalid hour. Use a value between 00 and 23.');
  }

  if (minute < 0 || minute > 59) {
    throw new Error('Invalid minute. Use a value between 00 and 59.');
  }

  return {
    hour,
    minute,
    value,
  };
}

export function toSystemdOnCalendar(schedule: DailySchedule): string {
  return `*-*-* ${pad(schedule.hour)}:${pad(schedule.minute)}:00`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
