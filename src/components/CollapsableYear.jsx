import { getMonth } from "../utils/getMonth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLocalStorage } from "../utils/localStorage";

export const CollapsableYear = ({ months, year, sold }) => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(new Date().getFullYear() === year ? false : true);

  //___________________________________________________ Functions
  const goMonth = (month, solde) => {
    saveLocalStorage("solde", solde);
    navigate(`${year}/${month}`);
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
            strokeLinecap="round"
          />
        </svg>
        <h3>{year}</h3>
        <span></span>
      </div>
      {!collapse && (
        <ul className="monthsContainer">
          {months.map((month, idx) => {
            return (
              <li key={idx} className="monthRow" onClick={() => goMonth(month, sold[idx])}>
                <div>{getMonth(month)}</div>
                <div className="monthSolde">{sold[idx]} €</div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
