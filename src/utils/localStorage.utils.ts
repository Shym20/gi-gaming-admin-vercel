import Cookies from "js-cookie";
// import { useState } from "react";
// const [isLoggedIn, setIsLoggedIn] = useState(false);

export const getTokenLocal = () => {
  return Cookies.get("giGamingAdmin_auth_token");
};

export const getUserLocal = () => {
  const user = Cookies.get("gi-gaming-admin_ufo");

  if (user !== null && user !== undefined) {
    return JSON.parse(user);
    // setIsLoggedIn(true);
  } else {
    return null;
    // setIsLoggedIn(false);
  }
};

export const setTokenLocal = (token: any | null) => {
  Cookies.set("giGamingAdmin_auth_token", token, {
    expires: 30,
    path: "/", // ✅ IMPORTANT
  });
};

export const setUserLocal = (user: any | null) => {
  Cookies.set("gi-gaming-admin_ufo", JSON.stringify(user), {
    expires: 30,
    path: "/", // ✅ IMPORTANT
  });
};