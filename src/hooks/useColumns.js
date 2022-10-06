import { useMemo } from "react";

export default function useColumns() {
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Libellé",
        accessor: "lib",
      },
      {
        Header: "Débit/Crédit",
        accessor: "value",
      },
      {
        Header: "Solde",
        accessor: "solde",
      },
      {
        Header: "Récurrent",
        accessor: "recurrent",
      },
    ],
    []
  );

  return columns;
}
