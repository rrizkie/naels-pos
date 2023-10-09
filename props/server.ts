import { MENU, SERVER_COKIES_KEY, STORAGE_KEY } from "@/constants";
import { getCookie, setCookie } from "cookies-next";

export const loginPageHandler = ({ req, res }: any) => {
  let _access_token =
    getCookie(SERVER_COKIES_KEY.ACCESS_TOKEN, { req, res }) || null;

  if (_access_token) {
    return {
      props: {},
      redirect: {
        permanent: true,
        destination: MENU.DASHBOARD,
      },
    };
  }

  return {
    props: {},
  };
};

export const redirectPageHandler = ({ req, res, query }: any) => {
  let options: any = {
    req,
    res,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  };
  if (query) {
    setCookie(SERVER_COKIES_KEY.ACCESS_TOKEN, query.access_token, options);
    setCookie(SERVER_COKIES_KEY.USERNAME, query.username, options);
    setCookie(SERVER_COKIES_KEY.ROLE, query.role, options);
    setCookie(SERVER_COKIES_KEY.BRANCH, query.branch, options);
  }

  return {
    props: {},
    redirect: {
      destination: MENU.DASHBOARD,
    },
  };
};

export const mainPageHandler = ({ req, res, query }: any) => {
  const _access_token =
    getCookie(SERVER_COKIES_KEY.ACCESS_TOKEN, { req, res }) || null;
  const _username = getCookie(SERVER_COKIES_KEY.USERNAME, { req, res }) || null;
  const _role = getCookie(SERVER_COKIES_KEY.ROLE, { req, res }) || null;
  const _branch = getCookie(SERVER_COKIES_KEY.BRANCH, { req, res }) || null;

  if (!_access_token) {
    return {
      props: {},
      redirect: {
        permanent: true,
        destination: MENU.LOGIN,
      },
    };
  }

  return {
    props: {
      access_token: _access_token || null,
      username: _username || null,
      role: _role || null,
      branch: _branch || null,
      isLoggedIn: !!_access_token,
    },
  };
};

export const logoutHandler = ({ req, res }: any) => {
  let destination = MENU.LOGIN;
  if (req && res) {
    let options = {
      req,
      res,
      maxAge: 0,
    };
    setCookie(SERVER_COKIES_KEY.ACCESS_TOKEN, "", options);
    setCookie(SERVER_COKIES_KEY.USERNAME, "", options);
    setCookie(SERVER_COKIES_KEY.ROLE, "", options);
    setCookie(SERVER_COKIES_KEY.BRANCH, "", options);
  }
  return {
    redirect: {
      permanent: true,
      destination,
    },
    props: {},
  };
};
