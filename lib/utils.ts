import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - createdAt.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedYears = Math.floor(elapsedDays / 365);

  if (elapsedYears > 0) {
    return `${elapsedYears} year${elapsedYears !== 1 ? "s" : ""} ago`;
  } else if (elapsedDays > 0) {
    return `${elapsedDays} day${elapsedDays !== 1 ? "s" : ""} ago`;
  } else if (elapsedHours > 0) {
    return `${elapsedHours} hour${elapsedHours !== 1 ? "s" : ""} ago`;
  } else if (elapsedMinutes > 0) {
    return `${elapsedMinutes} minute${elapsedMinutes !== 1 ? "s" : ""} ago`;
  } else {
    return `${elapsedSeconds} second${elapsedSeconds !== 1 ? "s" : ""} ago`;
  }
};

export const formatLargeNumber = (number: number): string => {
  if (Math.abs(number) >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (Math.abs(number) >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toString();
  }
};

export function getJoinedDate(date: Date): string {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const joinedDate = `${month} ${year}`;

  return joinedDate;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}
interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({params, keysToRemove}: RemoveUrlQueryParams) => {

  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}