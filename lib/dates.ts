import { differenceInDays, differenceInMonths, differenceInYears } from "date-fns";

export function getTimeTogether(startDate: Date) {
  const now = new Date();
  
  if (now < startDate) {
    return { days: 0, months: 0, years: 0, totalDays: 0 };
  }

  const totalDays = differenceInDays(now, startDate);
  const years = differenceInYears(now, startDate);
  
  const lastAnniversary = new Date(startDate);
  lastAnniversary.setFullYear(lastAnniversary.getFullYear() + years);
  
  const months = differenceInMonths(now, lastAnniversary);
  
  const lastMonthAnniversary = new Date(lastAnniversary);
  lastMonthAnniversary.setMonth(lastMonthAnniversary.getMonth() + months);
  
  const days = differenceInDays(now, lastMonthAnniversary);

  return { days, months, years, totalDays };
}

export function formatTimeTogether(time: { days: number; months: number; years: number; totalDays: number }) {
  const parts = [];
  
  if (time.years > 0) {
    parts.push(`${time.years} ${time.years === 1 ? 'ano' : 'anos'}`);
  }
  if (time.months > 0) {
    parts.push(`${time.months} ${time.months === 1 ? 'mês' : 'meses'}`);
  }
  if (time.days > 0 || parts.length === 0) {
    parts.push(`${time.days} ${time.days === 1 ? 'dia' : 'dias'}`);
  }
  
  return parts.join(", ");
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}
