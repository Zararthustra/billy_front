import { CollapsableYear } from "./components/CollapsableYear";
import { Logout } from "./components/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSummary } from "./redux/summarySlice";
import { getLocalStorage } from "./utils/localStorage";
import { createMovements } from "./redux/movementSlice";
import { Reconnect } from "./components/Reconnect";

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

  //___________________________________________________ Functions

  const createNewMonth = () => {
    const newMonth =
      lastMonth === 12 ? 1 : lastMonth + 1 || new Date().getMonth();
    const newYear =
      newMonth === 1
        ? getYears.at(-1) + 1
        : getYears.at(-1) || new Date().getFullYear();

    dispatch(
      createSummary({
        year: newYear,
        month: newMonth,
        sold: lastSold,
      })
    );

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

    duplicatedRecs.map((item) => dispatch(createMovements(item)));
    
    navigate(`/${newYear}/${newMonth}`);
  };

  const goRecs = () => {
    navigate("/recurrences");
  };

  //___________________________________________________ Render

  return (
    <main className="summaryPage">
      <Logout />
      {getSummaryError === "401" && <Reconnect />}
      <div className="summaryHead">
        <h1>{getUsername}</h1>
      </div>
      <button className="primaryButton" onClick={createNewMonth}>
        Nouveau mois +
      </button>
      <button className="secondaryButton" onClick={goRecs}>
        Mes récurrences
      </button>
      {getYears.map((year, index) => {
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
            {getSummaryStatus === "loading" ? (
              <>Loading...</>
            ) : (
              getSummaryStatus === "succeeded" && (
                <CollapsableYear months={months} year={year} solds={solds} />
              )
            )}
          </div>
        );
      })}
    </main>
  );
};
