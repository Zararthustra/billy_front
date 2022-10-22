import { useMemo } from "react";

export default function useColumns() {
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "day",
      },
      {
        Header: "Libellé",
        accessor: "lib",
      },
      {
        Header: "Montant",
        accessor: "value",
      },
      {
        Header: "Solde",
        accessor: "sold",
      },
    ],
    []
  );

  return columns;
}
