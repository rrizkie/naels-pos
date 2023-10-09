export const BASE_URL = "http://localhost:8080/api/";

export const LOGO = "/images/naels-logo.png";

export const MENU = {
  LOGIN: "/",
  LOGOUT: "/logout",
  REDIRECT: "/redirect",
  DASHBOARD: "/dashboard",
  TRANSACTION: "/transaction",
};

export const SERVER_COKIES_KEY = {
  ACCESS_TOKEN: "__NAELS_ACCESS_TOKEN",
  USERNAME: "__NAELS_USERNAME",
  ROLE: "__NAELS_ROLE",
  BRANCH: "__NAELS_BRANCH",
};

export const STORAGE_KEY = {
  USER_INFO: "__NAELS_USER_INFO",
  ACCESS_TOKEN: "__NAELS_ACCESS_TOKEN",
};

export enum BRANCH {
  ALL_BRANCH = "ALL_BRANCH",
  TEBET = "TEBET",
  SANTA = "SANTA",
  LUBANG_BUAYA = "LUBANG_BUAYA",
}

export enum ROLE {
  DEV = "DEV",
  OWNER = "OWNER",
  BRANCH_OWNER = "BRANCH_OWNER",
  NAIL_ARTIST = "NAIL_ARTIST",
}
