import { Logout } from "./components/Logout";
import { Home } from "./components/Home";
import { useNavigate, useParams } from "react-router-dom";
import { getMonth } from "./utils/getMonth";
import { useEffect, useState } from "react";
import { MonthTable } from "./components/MonthTable";
import { AddRow } from "./components/AddRow";
import { useDispatch, useSelector } from "react-redux";
import { addRows } from "./redux/movementSlice";
import { updateSold } from "./redux/summarySlice";
import { getSold } from "./utils/getSold";
import { EditRow } from "./components/EditRow";
import { PDFTable } from "./utils/PDFTable";

export const Month = () => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getSummary = useSelector((state) => state.summary);
  // const getMovements = useSelector((state) => state.movements);
  const monthParam = parseInt(useParams().month);
  const yearParam = parseInt(useParams().year);
  const month = getMonth(monthParam) || false;
  const [rowToEdit, setRowToEdit] = useState(null);
  const [monthSold, setMonthSold] = useState(
    getSold(yearParam, monthParam, getSummary) || 0
  );
  const [movements, setMovements] = useState(
    useSelector((state) => state.movements).filter(
      (item) =>
        (item.year === yearParam && item.month === monthParam) || item.recurrent
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
    if (!correctMonthParam || !correctYearParam) return navigate("/accueil");
  }, [navigate, correctMonthParam, correctYearParam, monthSold]);

  //___________________________________________________ Functions

  const printTable = () => {
    let stringHtmlTable = PDFTable(
      movements,
      yearParam,
      monthParam,
      getSummary
    );
    let htmlTable = document.createElement("html");
    htmlTable.innerHTML = stringHtmlTable;
    const win = window.open();

    win.document.open();
    win.document.write(htmlTable.outerHTML);
    win.document.close();
    win.print();
    win.close();
  };

  const saveMonth = () => {
    dispatch(addRows(newRows));
    dispatch(
      updateSold({ year: yearParam, month: monthParam, sold: monthSold })
    );
    navigate("/accueil");
  };

  //___________________________________________________ Render
  return (
    <main className="monthPage">
      <Home />
      <Logout />
      {rowToEdit && (
        <EditRow
          month={parseInt(monthParam)}
          year={parseInt(yearParam)}
          row={rowToEdit}
          setRow={setRowToEdit}
          movements={movements}
          setMovements={setMovements}
        />
      )}
      <div className="monthHead">
        <h1>{month}</h1>
        <h2>{monthSold} €</h2>
      </div>
      {!rowToEdit && (
        <AddRow
          month={parseInt(monthParam)}
          year={parseInt(yearParam)}
          movements={movements}
          setMovements={setMovements}
          newRows={newRows}
          setNewRows={setNewRows}
        />
      )}
      <div className="tableContainer">
        <MonthTable
          month={parseInt(monthParam)}
          year={parseInt(yearParam)}
          lastMonth={monthParam - 1 === 0 ? 12 : monthParam - 1}
          setMonthSold={setMonthSold}
          movements={movements}
          setRowToEdit={setRowToEdit}
        />
      </div>

      <button className="primaryButton" onClick={saveMonth}>
        Enregistrer
      </button>
      <button className="primaryButton" onClick={printTable}>
        Imprimer
      </button>
    </main>
  );
};
