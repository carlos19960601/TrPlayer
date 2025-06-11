import dayjs from "@renderer/lib/dayjs";
import { type ClassValue, clsx } from "clsx";
import { DurationUnitType } from "dayjs/plugin/duration";
import i18next from "i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDuration(
  duration: number,
  unit: DurationUnitType = "millisecond",
  format = "mm:ss"
) {
  dayjs.locale(i18next.resolvedLanguage?.toLowerCase() || "en");
  const display = dayjs.duration(duration, unit).format(format);
  return display;
}