import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Login } from "../Login";
import { retrieveMovements } from "../redux/movementSlice";
import { retrieveSummary } from "../redux/summarySlice";
import { getLocalStorage } from "../utils/localStorage";

export const ProtectedRoutes = () => {
  const dispatch = useDispatch();

  const getSummaryStatus = useSelector((state) => state.summary.status);
  const getMovementsStatus = useSelector((state) => state.movements.status);

  const [isAuth, setIsAuth] = useState(
    getLocalStorage("access") ? true : false
  );

  useEffect(() => {
    if (
      isAuth &&
      getSummaryStatus === "idle" &&
      getMovementsStatus === "idle"
    ) {
      dispatch(retrieveSummary());
      dispatch(retrieveMovements());
    }
  }, [getSummaryStatus, getMovementsStatus, isAuth, dispatch]);

  return isAuth ? <Outlet /> : <Login setIsAuth={setIsAuth} />;
};
