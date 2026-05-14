export const APP_NAME = "Homify";
export const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "/api/v1").replace(
  /\/$/,
  "",
);

export const NAVIGATION_BREAKPOINT = 1024;
export const PAGE_SIZE = 10;
