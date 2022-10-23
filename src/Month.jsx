import { Logout } from "./components/Logout";
import { Home } from "./components/Home";
import { useNavigate, useParams } from "react-router-dom";
import { getMonth } from "./utils/getMonth";
import { useState } from "react";
import { MonthTable } from "./components/MonthTable";
import { AddRow } from "./components/AddRow";
import { useDispatch, useSelector } from "react-redux";
import { createMovements } from "./redux/movementSlice";
import { updateSummary } from "./redux/summarySlice";
import { EditRow } from "./components/EditRow";
import { PDFTable } from "./utils/PDFTable";
import CountUp from "react-countup";

export const Month = () => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const yearParam = parseInt(useParams().year);
  const monthParam = parseInt(useParams().month);
  const month = getMonth(monthParam) || false;
  const lastMonth = monthParam - 1 === 0 ? 12 : monthParam - 1;
  const yearOfLastMonth = lastMonth === 12 ? yearParam - 1 : yearParam;

  const getSummary = useSelector((state) => state.summary.summary);
  // const getSummaryStatus = useSelector((state) => state.summary.status); // TODO LOADER
  const getMonthSummary =
    getSummary.filter(
      (item) => item.year === yearParam && item.month === monthParam
    )[0] || {};
  const getLastMonthSummary =
    getSummary.filter(
      (item) => item.year === yearOfLastMonth && item.month === lastMonth
    )[0] || {};

  const getAllMovements = useSelector((state) => state.movements.movements);
  // const getMovementsStatus = useSelector((state) => state.movements.status); // TODO LOADER
  const getMonthMovements = getAllMovements.filter(
    (item) => item.year === yearParam && item.month === monthParam
  );

  const [rowToEdit, setRowToEdit] = useState(null);
  const [monthSold, setMonthSold] = useState(getMonthSummary.sold);
  const [newRows, setNewRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const libsArray = [...new Set(getAllMovements.map((item) => item.lib))];
  // const [saved, setSaved] = useState(false);

  //___________________________________________________ Lifecycle
  // // Redirect if uri params month is not created yet
  // useEffect(() => {
  //   const monthObjectIsEmpty = Object.keys(getMonthSummary).length === 0;
  //   if (
  //     (!monthObjectIsEmpty && getMonthSummary.month !== monthParam) ||
  //     (!monthObjectIsEmpty && getMonthSummary.year !== yearParam)
  //   )
  //     return navigate("/accueil");
  // }, [navigate, monthParam, yearParam, getMonthSummary]);

  //  useEffect(() => {
  //   if (getMonthMovements) {
  //     setMovements(getMonthMovements)
  //   }
  // }, [getMonthMovements]);

  //___________________________________________________ Functions
  const goMonth = (direction) => {
    const nextMonth = monthParam + 1 === 13 ? 1 : monthParam + 1;
    const yearOfNextMonth = nextMonth === 1 ? yearParam + 1 : yearParam;
    const prevMonth = monthParam - 1 === 0 ? 12 : monthParam - 1;
    const yearOfPrevMonth = prevMonth === 12 ? yearParam - 1 : yearParam;

    const existingMonths = getSummary.map((item) => item.month);
    const existingYears = getSummary.map((item) => item.year);

    if (direction === "next") {
      if (
        !existingMonths.includes(nextMonth) ||
        !existingYears.includes(yearOfNextMonth)
      )
        return;
      navigate(`/${yearOfNextMonth}/${nextMonth}`);
    } else {
      if (
        !existingMonths.includes(prevMonth) ||
        !existingYears.includes(yearOfPrevMonth)
      )
        return;
      navigate(`/${yearOfPrevMonth}/${prevMonth}`);
    }
  };

  const printTable = () => {
    let stringHtmlTable = PDFTable(
      getMonthMovements,
      yearParam,
      monthParam,
      getLastMonthSummary
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
    if (getMonthSummary.sold !== monthSold) {
      dispatch(updateSummary({ id: getMonthSummary.id, sold: monthSold }));
      dispatch(createMovements(newRows));
      // setSaved(true); // TODO add toaster here
    }
    setNewRows([]);
    window.location.reload();
  };

  //___________________________________________________ Render
  return (
    <main className="monthPage">
      {!rowToEdit && <Home />}
      {!rowToEdit && <Logout />}
      {rowToEdit && (
        <EditRow
          month={parseInt(monthParam)}
          year={parseInt(yearParam)}
          row={rowToEdit}
          setRow={setRowToEdit}
          deletedRows={deletedRows}
          setDeletedRows={setDeletedRows}
          libsArray={libsArray}
          isRec={false}
        />
      )}
      <div className="monthHead">
        <div className="arrow" onClick={() => goMonth("prev")}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={
              getSummary
                .map((item) => item.month)
                .includes(monthParam - 1 === 0 ? 12 : monthParam - 1)
                ? {}
                : { display: "none" }
            }
          >
            <path d="M70.1549 68.595C70.5036 68.9437 70.7801 69.3576 70.9688 69.8131C71.1575 70.2687 71.2546 70.7569 71.2546 71.25C71.2546 71.7431 71.1575 72.2313 70.9688 72.6869C70.7801 73.1424 70.5036 73.5563 70.1549 73.905C69.8062 74.2537 69.3923 74.5302 68.9368 74.7189C68.4812 74.9076 67.993 75.0047 67.4999 75.0047C67.0068 75.0047 66.5186 74.9076 66.063 74.7189C65.6075 74.5302 65.1936 74.2537 64.8449 73.905L38.5949 47.655C38.2457 47.3067 37.9686 46.8928 37.7796 46.4372C37.5905 45.9817 37.4932 45.4932 37.4932 45C37.4932 44.5067 37.5905 44.0183 37.7796 43.5627C37.9686 43.1072 38.2457 42.6933 38.5949 42.345L64.8449 16.095C65.1936 15.7463 65.6075 15.4698 66.063 15.2811C66.5186 15.0924 67.0068 14.9953 67.4999 14.9953C67.993 14.9953 68.4812 15.0924 68.9368 15.2811C69.3923 15.4698 69.8062 15.7463 70.1549 16.095C70.5036 16.4437 70.7801 16.8576 70.9688 17.3131C71.1575 17.7687 71.2546 18.2569 71.2546 18.75C71.2546 19.2431 71.1575 19.7313 70.9688 20.1869C70.7801 20.6424 70.5036 21.0563 70.1549 21.405L46.5524 45L70.1549 68.595ZM14.9999 71.25C14.9999 72.2446 15.395 73.1984 16.0982 73.9016C16.8015 74.6049 17.7553 75 18.7499 75C19.7445 75 20.6983 74.6049 21.4016 73.9016C22.1048 73.1984 22.4999 72.2446 22.4999 71.25L22.4999 18.75C22.4999 17.7554 22.1048 16.8016 21.4016 16.0983C20.6983 15.3951 19.7445 15 18.7499 15C17.7553 15 16.8015 15.3951 16.0982 16.0983C15.395 16.8016 14.9999 17.7554 14.9999 18.75L14.9999 71.25Z" />
          </svg>
        </div>
        <div className="monthHeadTitle">
          <h1>{month}</h1>
          <h2>
            <CountUp
              end={monthSold % 1 !== 0 ? monthSold?.toFixed(2) : monthSold || 0}
              duration={2}
              decimals={monthSold % 1 !== 0 ? 2 : 0}
              decimal={","}
              separator={" "}
            />{" "}
            €
          </h2>
        </div>
        <div className="arrow" onClick={() => goMonth("next")}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={
              getSummary
                .map((item) => item.month)
                .includes(monthParam + 1 === 13 ? 1 : monthParam + 1)
                ? {}
                : { display: "none" }
            }
          >
            <path d="M19.8451 21.405C19.4964 21.0563 19.2199 20.6424 19.0312 20.1869C18.8425 19.7313 18.7454 19.2431 18.7454 18.75C18.7454 18.2569 18.8425 17.7687 19.0312 17.3131C19.2199 16.8576 19.4964 16.4437 19.8451 16.095C20.1938 15.7463 20.6077 15.4698 21.0632 15.2811C21.5188 15.0924 22.007 14.9953 22.5001 14.9953C22.9932 14.9953 23.4814 15.0924 23.937 15.2811C24.3925 15.4698 24.8064 15.7463 25.1551 16.095L51.4051 42.345C51.7543 42.6933 52.0314 43.1072 52.2204 43.5628C52.4095 44.0183 52.5068 44.5068 52.5068 45C52.5068 45.4933 52.4095 45.9817 52.2204 46.4373C52.0314 46.8928 51.7543 47.3067 51.4051 47.655L25.1551 73.905C24.8064 74.2537 24.3925 74.5302 23.937 74.7189C23.4814 74.9076 22.9932 75.0047 22.5001 75.0047C22.007 75.0047 21.5188 74.9076 21.0632 74.7189C20.6077 74.5302 20.1938 74.2537 19.8451 73.905C19.4964 73.5563 19.2199 73.1424 19.0312 72.6869C18.8425 72.2313 18.7454 71.7431 18.7454 71.25C18.7454 70.7569 18.8425 70.2687 19.0312 69.8131C19.2199 69.3576 19.4964 68.9437 19.8451 68.595L43.4476 45L19.8451 21.405ZM75.0001 18.75C75.0001 17.7554 74.605 16.8016 73.9018 16.0984C73.1985 15.3951 72.2447 15 71.2501 15C70.2555 15 69.3017 15.3951 68.5984 16.0984C67.8952 16.8016 67.5001 17.7554 67.5001 18.75V71.25C67.5001 72.2446 67.8952 73.1984 68.5984 73.9017C69.3017 74.6049 70.2555 75 71.2501 75C72.2447 75 73.1985 74.6049 73.9018 73.9017C74.605 73.1984 75.0001 72.2446 75.0001 71.25V18.75Z" />
          </svg>
        </div>
      </div>
      <AddRow
        month={parseInt(monthParam)}
        year={parseInt(yearParam)}
        libsArray={libsArray}
        newRows={newRows}
        setNewRows={setNewRows}
        isRec={false}
      />
      <div className="tableContainer">
        <MonthTable
          lastMonthSummary={getLastMonthSummary}
          lastMonth={monthParam - 1 === 0 ? 12 : monthParam - 1}
          setMonthSold={setMonthSold}
          movements={getMonthMovements.concat(newRows)}
          setRowToEdit={setRowToEdit}
          deletedRows={deletedRows}
        />
      </div>
      <button className="primaryButton" onClick={saveMonth}>
        Enregistrer
      </button>
      <button className="secondaryButton" onClick={printTable}>
        Générer un PDF
      </button>
    </main>
  );
};
