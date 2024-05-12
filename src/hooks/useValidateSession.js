import { useCookies } from "react-cookie";

export const useValidateSession = () => {
  const [cookie, setCookie] = useCookies(["user_name", "user_email"]);

  // type : 'user_name', 'user_email'
  const saveUserInfo = ({ type, context }) => {
    const time = 3600; //1시간
    const expiration = new Date(Date.now() + time * 24 * 30 * 1000); // 30일
    setCookie(type, context, {
      secure: false,
      sameSite: "lax",
      path: "/",
      expires: expiration,
    });
  };

  const isEmailSaved = () => {
    if (cookie.user_email) {
      return true;
    } else return false;
  };

  const isNameSaved = () => {
    if (cookie.user_name) return true;
    else return false;
  };

  const getEmail = () => {
    return cookie.user_email ? cookie.user_email : "";
  };

  const getName = () => {
    return cookie.user_name ? cookie.user_name : "";
  };

  return { saveUserInfo, isEmailSaved, isNameSaved, getEmail, getName };
};
