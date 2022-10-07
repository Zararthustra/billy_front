import { useTable, useSortBy } from "react-table";
import useColumns from "../hooks/useColumns";
import { useEffect } from "react";
import { getLocalStorage } from "../utils/localStorage";

export const MonthTable = ({ lastMonth, setMonthSold, movements }) => {
  //___________________________________________________ Variables

  const data = movements; //useSelector((state) => state.movements);

  const columns = useColumns();

  let incrementedSoldes = getLocalStorage("solde") || 0;
  let catchValue = 0;

  useEffect(() => {
    setMonthSold(incrementedSoldes);
  }, [setMonthSold, incrementedSoldes]);

  //___________________________________________________ Functions

  const handleEditCheck = () => {};

  const table = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;

  //___________________________________________________ Render

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted ? (column.isSortedDesc ? "desc" : "asc") : ""
                }
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>
            {lastMonth}
            <br />
            {getLocalStorage("solde") || 0} €
          </td>
          <td></td>
        </tr>
        {
          // Loop over the table rows filtered by month and year
          rows.map((row) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()}>
                {
                  // Loop over the rows cells
                  row.cells.map((cell) => {
                    if (cell.column.id === "value") {
                      catchValue = cell.value;
                      return (
                        <td
                          style={{
                            color:
                              catchValue < 0 ? "var(--red)" : "var(--green)",
                          }}
                          {...cell.getCellProps()}
                        >
                          {catchValue < 0 ? catchValue * -1 : catchValue}
                        </td>
                      );
                    }
                    if (cell.column.id === "solde") {
                      return (
                        <td {...cell.getCellProps()}>
                          {(incrementedSoldes += catchValue)}
                        </td>
                      );
                    }
                    if (cell.column.id === "recurrent")
                      return (
                        <td {...cell.getCellProps()}>
                          <label className="box">
                            <input
                              type="checkbox"
                              onChange={() => handleEditCheck}
                            />
                            <svg
                              className={`check ${
                                cell.value ? "check--active" : ""
                              }`}
                              aria-hidden="true"
                              viewBox="0 0 15 10"
                              fill="none"
                            >
                              <path
                                d="M1 4.5L5 9L14 1"
                                strokeWidth="2"
                                stroke={cell.value ? "#fff" : "none"}
                              />
                            </svg>
                          </label>
                        </td>
                      );
                    return (
                      // Apply the cell props
                      <td {...cell.getCellProps()}>
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};
