import { getMonth } from "../utils/getMonth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLocalStorage } from "../utils/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { deleteSummary } from "../redux/summarySlice";

export const CollapsableYear = ({ months, year, solds }) => {
  //___________________________________________________ Variables

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSummary = useSelector((state) => state.summary.summary);
  const [collapse, setCollapse] = useState(
    new Date().getFullYear() === year ? false : true
  );
  const lastSummary = getSummary.at(-1);

  //___________________________________________________ Functions

  const goMonth = (month, solde) => {
    saveLocalStorage("solde", solde);
    navigate(`/${year}/${month}`);
  };

  const deleteMonth = (month) => {
    const summaryId = getSummary.filter(
      (item) => item.year === year && item.month === month
    )[0].id;

    return dispatch(deleteSummary(summaryId));
  };

  //___________________________________________________ Render

  return (
    <>
      <div className="collapseDiv" onClick={() => setCollapse(!collapse)}>
        <svg
          width="24"
          height="24"
          viewBox={collapse ? "0 0 14 24" : "0 0 24 14"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={collapse ? "M2 2L12 12L2 22" : "M22 2L12 12L2 2"}
            strokeWidth="5"
            stroke={collapse ? "" : "var(--orange)"}
            strokeLinecap="round"
          />
        </svg>
        <h3 style={{ color: collapse ? "" : "var(--orange)" }}>{year}</h3>
        <span></span>
      </div>
      {!collapse && (
        <ul className="monthsContainer">
          {months.map((month, idx) => {
            const isLastSummary =
              getSummary.filter(
                (item) => item.year === year && item.month === month
              )[0].id === lastSummary.id;

            return (
              <li key={idx} className="monthRow">
                <div>{getMonth(month)}</div>
                <div className="monthSolde">
                  {solds[idx] % 1 !== 0
                    ? parseFloat(solds[idx]?.toFixed(2)).toLocaleString()
                    : solds[idx].toLocaleString()}{" "}
                  €
                </div>
                <div className="summaryOptions">
                  <svg
                    onClick={() => goMonth(month, solds[idx])}
                    className="goMonth"
                    width="30"
                    height="30"
                    viewBox="0 -1 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.25 3.75H18.75M26.25 3.75L15 15M26.25 3.75V11.25"
                      strokeWidth="1.875"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.25 16.25V23.75C26.25 24.413 25.9866 25.0489 25.5178 25.5178C25.0489 25.9866 24.413 26.25 23.75 26.25H6.25C5.58696 26.25 4.95107 25.9866 4.48223 25.5178C4.01339 25.0489 3.75 24.413 3.75 23.75V6.25C3.75 5.58696 4.01339 4.95107 4.48223 4.48223C4.95107 4.01339 5.58696 3.75 6.25 3.75H13.75"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {isLastSummary && (
                    <svg
                      onClick={() => deleteMonth(month)}
                      className="deleteMonth"
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.425 11.25L17.9925 22.5M12.0075 22.5L11.575 11.25M24.035 7.2375C24.4625 7.3025 24.8875 7.37125 25.3125 7.445M24.035 7.23875L22.7 24.5913C22.6455 25.2978 22.3263 25.9577 21.8063 26.4391C21.2862 26.9204 20.6036 27.1877 19.895 27.1875H10.105C9.39637 27.1877 8.71378 26.9204 8.19372 26.4391C7.67367 25.9577 7.35449 25.2978 7.3 24.5913L5.965 7.2375M24.035 7.2375C22.5923 7.0194 21.1422 6.85387 19.6875 6.74125M4.6875 7.44375C5.1125 7.37 5.5375 7.30125 5.965 7.2375M5.965 7.2375C7.40767 7.0194 8.85779 6.85388 10.3125 6.74125M19.6875 6.74125V5.59625C19.6875 4.12125 18.55 2.89125 17.075 2.845C15.692 2.8008 14.308 2.8008 12.925 2.845C11.45 2.89125 10.3125 4.1225 10.3125 5.59625V6.74125M19.6875 6.74125C16.5672 6.5001 13.4328 6.5001 10.3125 6.74125"
                        strokeWidth="1.875"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
