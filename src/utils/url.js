import dayjs from "dayjs";
import { customAlphabet } from "nanoid";

const ALPHANUM = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nano = customAlphabet(ALPHANUM, 7);

export const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return !!u.protocol && !!u.hostname;
  } catch {
    return false;
  }
};

export const normalizeMinutes = (val) => {
  if (val === "" || val === null || val === undefined) return 30; // default
  const n = Number(val);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const isValidShortcode = (code) => /^[a-zA-Z0-9]{4,12}$/.test(code || "");

export const makeExpiryISO = (minutesFromNow) => dayjs().add(minutesFromNow, "minute").toISOString();

export const isExpired = (iso) => dayjs().isAfter(dayjs(iso));

export const randomCode = () => nano();

export const buildShortUrl = (code) => `${window.location.origin}/${code}`;
