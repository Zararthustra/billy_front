import ReactDOMServer from "react-dom/server";
import { getMonth } from "./getMonth";
import { getSold } from "./getSold";

export const PDFTable = (movements, year, month, getSummary) => {
  //___________________________________________________ Variables

  const style = ReactDOMServer.renderToString(
    <style>
      {`
      html {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      h1 {
        text-align: center;
        margin-top: 2rem;
      }

      h2 {
        text-align: center;
        margin-bottom: 2rem;
      }

      table {
        text-align: center;
        padding-bottom: 4rem;
      }
      
      table tbody tr:nth-child(even) {
        background-color: #fff4fc;
      }
      
      table tr:first-child td:nth-child(4) {
        background-color: #B20FCC;
        color: white;
        border-radius: 3px;
      }
      
      table td:nth-child(4):not(table tr:first-child td:nth-child(4)) {
        border-radius: 3px;
        background-color: #F9B33F;
        color: white;
      }
      
      table td:nth-child(3),
      table td:first-child,
      table td:nth-child(4) {
        font-weight: 600;
        font-size: 1.2rem;
      }
      
      /* head */
      table th {
        padding: 1rem;
        font-size: 1.2rem;
        text-align: center;
      }
      
      /* cell */
      table td {
        padding: 1rem 2rem;
      }
`}
    </style>
  );

  const lastMonth = month - 1 === 0 ? 12 : month - 1;
  const yearOfLastMonth = lastMonth === 12 ? year - 1 : year;
  let incrementedSoldes = getSold(yearOfLastMonth, lastMonth, getSummary) || 0;
  let catchValue = 0;
  const columns = ["Date", "Libellé", "Montant", "Solde"];

  const table = ReactDOMServer.renderToString(
    <table>
      <thead>
        <tr>
          {columns.map((item, index) => {
            return <th key={index}>{item}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>
            {getMonth(lastMonth)}
            <br />
            {getSold(yearOfLastMonth, lastMonth, getSummary) || 0} €
          </td>
          <td></td>
        </tr>
        {movements.map((item, index) => {
          catchValue = item.value;
          incrementedSoldes += catchValue;
          return (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.lib}</td>
              <td style={{ color: item.value > 0 ? "green" : "red" }}>
                {Math.abs(item.value)}
              </td>
              <td>
                {incrementedSoldes % 1 !== 0
                  ? incrementedSoldes.toFixed(2)
                  : incrementedSoldes}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const header = ReactDOMServer.renderToString(
    <>
      <h1>{getMonth(month)}</h1>
      <h2 style={{ color: incrementedSoldes > 0 ? "green" : "red" }}>
        {incrementedSoldes % 1 !== 0
          ? incrementedSoldes.toFixed(2)
          : incrementedSoldes}{" "}
        €
      </h2>
    </>
  );

  const docTitle = ReactDOMServer.renderToString(<title>Billy</title>);

  return docTitle + style + header + table;
};
