import { CollapsableYear } from "./components/CollapsableYear";
import { Logout } from "./components/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMonth } from "./redux/summarySlice";
import { getLocalStorage } from "./utils/localStorage";

export const Summary = () => {
  //___________________________________________________ Variables

  const getSummary = useSelector((state) => state.summary);
  const getAccount = getLocalStorage("account");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //___________________________________________________ Functions

  const createNewMonth = () => {
    const lastMonth = getSummary.at(-1).months.at(-1);
    const lastSold = getSummary.at(-1).solds.at(-1);
    const newMonth = lastMonth === 12 ? 1 : lastMonth + 1;
    const newYear =
      newMonth === 1 ? getSummary.at(-1).year + 1 : getSummary.at(-1).year;

    dispatch(addMonth({ year: newYear, month: newMonth, sold: lastSold }));
    navigate(`/${newYear}/${newMonth}`);
  };

  //___________________________________________________ Render
  return (
    <main className="summaryPage">
      <Logout />
      <div className="summaryHead">
        <h1>{getAccount}</h1>
      </div>
      {getSummary.map((yearObject, index) => {
        return (
          <div key={index} className="yearContainer">
            <CollapsableYear
              months={yearObject.months}
              year={yearObject.year}
              solds={yearObject.solds}
            />
          </div>
        );
      })}
      <button className="primaryButton" onClick={createNewMonth}>
        Nouveau mois +
      </button>
    </main>
  );
};
