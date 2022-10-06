import { useState } from "react";
import { Outlet } from "react-router";
import { Login } from "../Login";
import { getLocalStorage } from "../utils/localStorage";

export const ProtectedRoutes = () => {
  const account = getLocalStorage("account");
  const [isAuth, setIsAuth] = useState(account ? true : false);
  return isAuth ? <Outlet /> : <Login setIsAuth={setIsAuth} />;
};
