import { Logout } from "./components/Logout";
import { Home } from "./components/Home";
import { useNavigate, useParams } from "react-router-dom";
import { getMonth } from "./utils/getMonth";
import { useEffect, useState } from "react";
import { MonthTable } from "./components/MonthTable";
import { AddRow } from "./components/AddRow";
import { useSelector } from "react-redux";

export const Month = () => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  const getSummary = useSelector((state) => state.summary);
  const getMovements = useSelector((state) => state.month);
  const monthParam = parseInt(useParams().month);
  const yearParam = parseInt(useParams().year);
  const month = getMonth(monthParam) || false;
  const lastMonth = getMonth(monthParam - 1) || false;
  const [monthSold, setMonthSold] = useState(0);

  const correctMonthParam = getSummary
    .flatMap((item) => item.months)
    .includes(monthParam);
  const correctYearParam = getSummary
    .map((item) => item.year)
    .includes(yearParam);


  useEffect(() => {
    if (!correctMonthParam || !correctYearParam) return navigate("/");
  }, [navigate, correctMonthParam, correctYearParam, monthSold, getMovements]);

  //___________________________________________________ Functions


  //___________________________________________________ Render
  return (
    <main className="monthPage">
      <Home />
      <Logout />
      <div className="monthHead">
        <h1>{month}</h1>
        <h2>{monthSold} €</h2>
      </div>
      <div className="tableContainer">
        <MonthTable lastMonth={lastMonth} setMonthSold={setMonthSold} />
      </div>
      <AddRow />
      <button className="primaryButton">Enregistrer</button>
    </main>
  );
};
