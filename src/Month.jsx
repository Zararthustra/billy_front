import { Logout } from "./components/Logout";
import { Home } from "./components/Home";
import { useNavigate, useParams } from "react-router-dom";
import { getMonth } from "./utils/getMonth";
import { useState } from "react";
import { MonthTable } from "./components/MonthTable";
import { AddRow } from "./components/AddRow";
import { useDispatch, useSelector } from "react-redux";
import { createMovements, deleteMovements } from "./redux/movementSlice";
import { updateSummary } from "./redux/summarySlice";
import { EditRow } from "./components/EditRow";
import { PDFTable } from "./utils/PDFTable";
import CountUp from "react-countup";
import { Reconnect } from "./components/Reconnect";
import { RecIcon } from "./components/RecIcon";
import { Loader } from "./components/Loader";
import { Toaster } from "./components/Toaster";

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
  const getMonthSummary =
    getSummary.filter(
      (item) => item.year === yearParam && item.month === monthParam
    )[0] || {};
  const getLastMonthSummary =
    getSummary.filter(
      (item) => item.year === yearOfLastMonth && item.month === lastMonth
    )[0] || {};
  const getSummaryError401 =
    useSelector((state) => state.summary.error)
      ?.split(" ")
      .at(-1) === "401";

  const getAllMovements = useSelector((state) => state.movements.movements);
  const getMonthMovements = getAllMovements.filter(
    (item) => item.year === yearParam && item.month === monthParam
  );
  const getMovementsStatus = useSelector((state) => state.movements.status); // TODO LOADER
  const getMovementsError401 =
    useSelector((state) => state.movements.error)
      ?.split(" ")
      .at(-1) === "401";

  const [triggerToaster, setTriggerToaster] = useState(null);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [monthSold, setMonthSold] = useState(getMonthSummary.sold);
  const [newRows, setNewRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const libsArray = [...new Set(getAllMovements.map((item) => item.lib))];
  // const [saved, setSaved] = useState(false);

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
    if (newRows.length > 0)
      newRows.map((item) => dispatch(createMovements(item)));

    if (deletedRows.length > 0) {
      let removedEuros = 0;
      deletedRows.map((item) => {
        removedEuros += item.value;
        return dispatch(deleteMovements(item));
      });
      dispatch(
        updateSummary({
          id: getMonthSummary.id,
          sold: monthSold - removedEuros,
        })
      );
    }

    if (getMonthSummary.sold !== monthSold) {
      dispatch(updateSummary({ id: getMonthSummary.id, sold: monthSold })).then(
        (res) => {
          if (res.error?.message.split(" ").at(-1) === "401")
            setTriggerToaster({
              type: "error",
              message: res.error?.message,
            });
          else
            setTriggerToaster({
              type: "success",
              message: "Modifications enregistrées avec succès !",
            });
        }
      );
    } else
      setTriggerToaster({
        type: "info",
        message: "Il n'y a rien à enregistrer.",
      });

    setNewRows([]);
    setDeletedRows([]);
  };

  //___________________________________________________ Render
  return (
    <main className="monthPage">
      {!rowToEdit && <Home />}
      {!rowToEdit && <Logout />}
      {!rowToEdit && <RecIcon />}
      {triggerToaster && (
        <Toaster
          type={triggerToaster.type}
          message={triggerToaster.message}
          setTriggerToaster={setTriggerToaster}
        />
      )}
      {(getMovementsError401 || getSummaryError401) && <Reconnect />}
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
          setTriggerToaster={setTriggerToaster}
        />
      )}
      <div className="monthHead">
        <div className="monthHeadTitle">
          <h1>{month}</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "70vw",
            }}
          >
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

            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CountUp
                end={
                  monthSold % 1 !== 0 ? monthSold?.toFixed(2) : monthSold || 0
                }
                duration={2}
                decimals={monthSold % 1 !== 0 ? 2 : 0}
                decimal={","}
              />
              €
            </h2>
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
        </div>
        <AddRow
          month={parseInt(monthParam)}
          year={parseInt(yearParam)}
          libsArray={libsArray}
          newRows={newRows}
          setNewRows={setNewRows}
          isRec={false}
          setTriggerToaster={setTriggerToaster}
        />
      </div>
      <div className="monthButton">
        <button className="primaryButton" onClick={saveMonth}>
          <svg
            width="35"
            height="35"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.9781 8.70936L21.2906 4.02186C21.203 3.93497 21.0991 3.86623 20.9849 3.81957C20.8707 3.77292 20.7484 3.74927 20.625 3.74999H5.625C5.12772 3.74999 4.65081 3.94753 4.29917 4.29916C3.94754 4.65079 3.75 5.1277 3.75 5.62499V24.375C3.75 24.8723 3.94754 25.3492 4.29917 25.7008C4.65081 26.0524 5.12772 26.25 5.625 26.25H24.375C24.8723 26.25 25.3492 26.0524 25.7008 25.7008C26.0525 25.3492 26.25 24.8723 26.25 24.375V9.37498C26.2507 9.2516 26.2271 9.1293 26.1804 9.01507C26.1338 8.90085 26.065 8.79696 25.9781 8.70936ZM11.25 5.62499H18.75V9.37498H11.25V5.62499ZM18.75 24.375H11.25V16.875H18.75V24.375ZM20.625 24.375V16.875C20.625 16.3777 20.4275 15.9008 20.0758 15.5492C19.7242 15.1975 19.2473 15 18.75 15H11.25C10.7527 15 10.2758 15.1975 9.92417 15.5492C9.57254 15.9008 9.375 16.3777 9.375 16.875V24.375H5.625V5.62499H9.375V9.37498C9.375 9.87227 9.57254 10.3492 9.92417 10.7008C10.2758 11.0524 10.7527 11.25 11.25 11.25H18.75C19.2473 11.25 19.7242 11.0524 20.0758 10.7008C20.4275 10.3492 20.625 9.87227 20.625 9.37498V6.00936L24.375 9.75936V24.375H20.625Z"
              fill="white"
            />
          </svg>
          Enregistrer
        </button>
      </div>
      {getMovementsStatus === "loading" ? (
        <Loader />
      ) : (
        <>
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
        </>
      )}
      <button
        className="primaryButton"
        onClick={printTable}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0 1rem",
        }}
      >
        <svg
          width="35"
          height="35"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5654 16.8281L15.5742 16.7871C15.7441 16.0869 15.958 15.2139 15.791 14.4229C15.6797 13.7988 15.2197 13.5557 14.8271 13.5381C14.3643 13.5176 13.9512 13.7812 13.8486 14.165C13.6553 14.8682 13.8281 15.8291 14.1445 17.0537C13.7461 18.0029 13.1104 19.3828 12.6445 20.2031C11.7773 20.6514 10.6143 21.3428 10.4414 22.2158C10.4062 22.377 10.4473 22.582 10.5439 22.7666C10.6523 22.9717 10.8252 23.1299 11.0273 23.2061C11.1152 23.2383 11.2207 23.2646 11.3438 23.2646C11.8594 23.2646 12.6943 22.8486 13.8076 20.9385C13.9775 20.8828 14.1533 20.8242 14.3232 20.7656C15.1201 20.4961 15.9463 20.2148 16.6934 20.0889C17.5195 20.5313 18.46 20.8154 19.0986 20.8154C19.7314 20.8154 19.9805 20.4404 20.0742 20.2148C20.2383 19.8193 20.1592 19.3213 19.8926 19.0547C19.5059 18.6738 18.5654 18.5742 17.1006 18.7559C16.3799 18.3164 15.9082 17.7188 15.5654 16.8281ZM12.3516 21.2783C11.9443 21.8701 11.6367 22.166 11.4697 22.2949C11.666 21.9346 12.0498 21.5537 12.3516 21.2783ZM14.918 14.3789C15.0703 14.6396 15.0498 15.4277 14.9326 15.8262C14.7891 15.2432 14.7686 14.417 14.8535 14.3203C14.877 14.3232 14.8975 14.3408 14.918 14.3789ZM14.8711 17.9092C15.1846 18.4512 15.5801 18.917 16.0166 19.2627C15.3838 19.4063 14.8066 19.6436 14.291 19.8545C14.168 19.9043 14.0479 19.9541 13.9307 20.001C14.3203 19.2949 14.6455 18.4951 14.8711 17.9092V17.9092ZM19.4297 19.8281C19.4326 19.834 19.4355 19.8428 19.418 19.8545H19.4121L19.4063 19.8633C19.3828 19.8779 19.1426 20.0186 18.1084 19.6113C19.2979 19.5557 19.4268 19.8252 19.4297 19.8281V19.8281ZM25.0371 8.45508L18.7324 2.15039C18.5566 1.97461 18.3193 1.875 18.0703 1.875H5.625C5.10645 1.875 4.6875 2.29395 4.6875 2.8125V27.1875C4.6875 27.7061 5.10645 28.125 5.625 28.125H24.375C24.8936 28.125 25.3125 27.7061 25.3125 27.1875V9.12012C25.3125 8.87109 25.2129 8.63086 25.0371 8.45508V8.45508ZM23.1504 9.55078H17.6367V4.03711L23.1504 9.55078ZM23.2031 26.0156H6.79688V3.98438H15.6445V10.3125C15.6445 10.6388 15.7742 10.9518 16.0049 11.1826C16.2357 11.4133 16.5487 11.543 16.875 11.543H23.2031V26.0156Z"
            fill="white"
          />
        </svg>
        Générer un PDF
      </button>
    </main>
  );
};
