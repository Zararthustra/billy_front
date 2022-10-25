import { CollapsableYear } from "./components/CollapsableYear";
import { Logout } from "./components/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSummary } from "./redux/summarySlice";
import { getLocalStorage } from "./utils/localStorage";
import { createMovements } from "./redux/movementSlice";
import { Reconnect } from "./components/Reconnect";
import { RecIcon } from "./components/RecIcon";
import { Loader } from "./components/Loader";
import { Toaster } from "./components/Toaster";
import { useState } from "react";

export const Summary = () => {
  //___________________________________________________ Variables

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getSummary = useSelector((state) => state.summary.summary);
  const getSummaryStatus = useSelector((state) => state.summary.status);
  const getSummaryError = useSelector((state) => state.summary.error)
    ?.split(" ")
    .at(-1);

  const getUsername = getLocalStorage("username");
  const getRecMovements = useSelector(
    (state) => state.movements.movements
  ).filter((item) => item.rec);

  let lastMonth;
  let lastSold;
  let getYears = getSummary
    .map((summary) => summary.year)
    .filter((year, index, years) => years.indexOf(year) === index);
  const [triggerToaster, setTriggerToaster] = useState(null);

  //___________________________________________________ Functions

  const createNewMonth = () => {
    const newMonth =
      lastMonth === 12 ? 1 : lastMonth + 1 || new Date().getMonth() + 1;
    const newYear =
      newMonth === 1
        ? getYears.at(-1) + 1
        : getYears.at(-1) || new Date().getFullYear();
    const duplicatedRecs = getRecMovements.map((item) => {
      return {
        year: newYear,
        month: newMonth,
        day: item.day,
        lib: item.lib,
        value: item.value,
        sold: 0,
        rec: false,
      };
    });

    dispatch(
      createSummary({
        year: newYear,
        month: newMonth,
        sold: lastSold,
      })
    )
      .then((res) => {
        if (res.error?.message.split(" ").at(-1) === "401")
          setTriggerToaster({
            type: "error",
            message: res.error?.message,
          });
        else {
          duplicatedRecs.map((item) => dispatch(createMovements(item)));
          navigate(`/${newYear}/${newMonth}`);
        }
      })
      .catch((err) => console.log(err));
  };

  //___________________________________________________ Render

  return (
    <main className="summaryPage">
      <Logout />
      <RecIcon />
      {triggerToaster && (
        <Toaster
          type={triggerToaster.type}
          message={triggerToaster.message}
          setTriggerToaster={setTriggerToaster}
        />
      )}
      {getSummaryError === "401" && <Reconnect />}
      <div className="summaryHead">
        <h1 style={{fontSize: getUsername.length > 10 ? "3rem" :"7rem"}}>{getUsername}</h1>
      </div>
      <div className="summaryButton">
        <button className="primaryButton" onClick={createNewMonth}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 22.5H15V25H2.5V22.5ZM2.5 13.75H27.5V16.25H2.5V13.75ZM2.5 5H27.5V7.5H2.5V5ZM22.5 22.5V18.75H25V22.5H28.75V25H25V28.75H22.5V25H18.75V22.5H22.5Z"
              fill="white"
            />
          </svg>
          Nouveau mois
        </button>
      </div>
      {getSummaryStatus === "loading" ? (
        <Loader />
      ) : (
        getYears.map((year, index) => {
          const months = getSummary
            .filter((item) => item.year === year)
            .map((item) => {
              lastMonth = item.month;
              return item.month;
            });
          const solds = getSummary
            .filter((item) => item.year === year)
            .map((item) => {
              lastSold = item.sold;
              return item.sold;
            });
          return (
            <div key={index} className="yearContainer">
              <CollapsableYear months={months} year={year} solds={solds} />
            </div>
          );
        })
      )}
    </main>
  );
};
