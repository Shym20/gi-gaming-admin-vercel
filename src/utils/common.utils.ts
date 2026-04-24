import Cookies from "js-cookie";
export const logout = (history: any) => {
  Cookies.remove("gi-gaming-admin_ufo");
  Cookies.remove("gi-gaming-admin_auth_token");
  return history("/login");
};
