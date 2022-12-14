import { useTable, useSortBy } from "react-table";
import useColumns from "../hooks/useColumns";
import { useEffect } from "react";
import { getMonth } from "../utils/getMonth";

export const MonthTable = ({
  lastMonthSummary,
  lastMonth,
  setMonthSold,
  movements,
  setRowToEdit,
  deletedRows,
}) => {
  //___________________________________________________ Variables

  const columns = useColumns();

  let incrementedSoldes = lastMonthSummary.sold || 0;

  let catchValue = 0;

  let data = movements;

  //___________________________________________________ Functions

  const table = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "day",
            desc: false,
          },
        ],
      },
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;

  //___________________________________________________ Lifecycle

  useEffect(() => {
    setMonthSold(incrementedSoldes);
  }, [incrementedSoldes, setMonthSold, table.data]);

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
            {getMonth(lastMonth)}
            <br />
            {lastMonthSummary.sold === undefined
              ? 0
              : lastMonthSummary.sold % 1 !== 0
              ? parseFloat(lastMonthSummary.sold?.toFixed(2)).toLocaleString()
              : lastMonthSummary.sold.toLocaleString()}{" "}
            ???
          </td>
        </tr>
        {
          // Loop over the table rows
          rows.map((row, index) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr
                {...row.getRowProps()}
                key={index}
                onClick={() =>
                  row.original.id !== undefined &&
                  !deletedRows
                    .map((item) => item.id)
                    .includes(row.original.id) &&
                  setRowToEdit(row.original)
                }
                className={
                  row.original.id === undefined
                    ? "temporaryAddRow"
                    : deletedRows
                        .map((item) => item.id)
                        .includes(row.original.id)
                    ? "temporaryDelRow"
                    : ""
                }
              >
                {
                  // Loop over the rows cells
                  row.cells.map((cell, indexx) => {
                    if (cell.column.id === "value") {
                      catchValue = cell.value;
                      return (
                        <td
                          key={indexx}
                          style={{
                            color:
                              catchValue < 0 ? "var(--red)" : "var(--green)",
                          }}
                          {...cell.getCellProps()}
                        >
                          {catchValue < 0
                            ? catchValue % 1 === 0
                              ? (catchValue * -1).toString().replace(".", ",")
                              : (catchValue * -1)
                                  .toFixed(2)
                                  .toString()
                                  .replace(".", ",")
                            : catchValue % 1 === 0
                            ? catchValue.toLocaleString()
                            : catchValue
                                .toFixed(2)
                                .toLocaleString()
                                .replace(".", ",")}
                        </td>
                      );
                    }
                    if (cell.column.id === "sold") {
                      if (
                        !deletedRows
                          .map((item) => item.id)
                          .includes(row.original.id)
                      )
                        incrementedSoldes += catchValue;
                      return (
                        <td key={indexx} {...cell.getCellProps()}>
                          {incrementedSoldes % 1 !== 0
                            ? incrementedSoldes
                                .toFixed(2)
                                .toLocaleString()
                                .replace(".", ",")
                            : incrementedSoldes
                                .toLocaleString()
                                .replace(".", ",")}
                        </td>
                      );
                    }
                    return (
                      // Apply the cell props
                      <td key={indexx} {...cell.getCellProps()}>
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
