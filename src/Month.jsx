import { Logout } from "./components/Logout";
import { Home } from "./components/Home";
import { useNavigate, useParams } from "react-router-dom";
import { getMonth } from "./utils/getMonth";
import { useEffect, useState } from "react";
import { MonthTable } from "./components/MonthTable";
import { AddRow } from "./components/AddRow";
import { useDispatch, useSelector } from "react-redux";
import { addRows } from "./redux/movementSlice";

export const Month = () => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getSummary = useSelector((state) => state.summary);
  // const getMovements = useSelector((state) => state.movements);
  const monthParam = parseInt(useParams().month);
  const yearParam = parseInt(useParams().year);
  const month = getMonth(monthParam) || false;
  const lastMonth = getMonth(monthParam - 1) || false;
  const [monthSold, setMonthSold] = useState(0);
  const [movements, setMovements] = useState(
    useSelector((state) => state.movements).filter(
      (item) => item.year === yearParam && item.month === monthParam
    )
  );
  const [newRows, setNewRows] = useState([]);

  const correctMonthParam = getSummary
    .flatMap((item) => item.months)
    .includes(monthParam);
  const correctYearParam = getSummary
    .map((item) => item.year)
    .includes(yearParam);

  useEffect(() => {
    if (!correctMonthParam || !correctYearParam) return navigate("/");
  }, [navigate, correctMonthParam, correctYearParam, monthSold]);

  //___________________________________________________ Functions

  const saveMonth = () => {
    console.log(movements, "1");
    dispatch(addRows(newRows));
    console.log(movements, "2");
    console.log("month saved");
  };

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
        <MonthTable
          lastMonth={lastMonth}
          setMonthSold={setMonthSold}
          movements={movements}
        />
      </div>
      <AddRow
        month={parseInt(monthParam)}
        year={parseInt(yearParam)}
        movements={movements}
        setMovements={setMovements}
        newRows={newRows}
        setNewRows={setNewRows}
      />
      <button className="primaryButton" onClick={saveMonth}>
        Enregistrer
      </button>
    </main>
  );
};
