import { Home } from "./components/Home";
import { Logout } from "./components/Logout";
import { useSelector } from "react-redux";
import { useState } from "react";
import { EditRow } from "./components/EditRow";
import { AddRow } from "./components/AddRow";
import { Reconnect } from "./components/Reconnect";

export const Recurrences = () => {
  //___________________________________________________ Variables
  const getMovementsError401 =
    useSelector((state) => state.movements.error)
      ?.split(" ")
      .at(-1) === "401";

  const getAllMovements = useSelector((state) => state.movements.movements);
  const getRecMovements = useSelector(
    (state) => state.movements.movements
  ).filter((item) => item.rec);

  const [triggerRefreshToken, setTriggerRefreshToken] = useState(false);
  const [newRows, setNewRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [deletedRows, setDeletedRows] = useState([]);
  const libsArray = [...new Set(getAllMovements.map((item) => item.lib))];

  //___________________________________________________ Functions
  //___________________________________________________ Render
  return (
    <main className="monthPage">
      {!rowToEdit && <Home />}
      {!rowToEdit && <Logout />}
      {(getMovementsError401 || triggerRefreshToken) && <Reconnect />}
      {rowToEdit && (
        <EditRow
          month={0}
          year={9999}
          row={rowToEdit}
          setRow={setRowToEdit}
          deletedRows={deletedRows}
          setDeletedRows={setDeletedRows}
          libsArray={libsArray}
          isRec={true}
          setTriggerRefreshToken={setTriggerRefreshToken}
        />
      )}
      <div className="monthHead">
        <h1>Récurrences</h1>
        <AddRow
          month={0}
          year={9999}
          libsArray={libsArray}
          newRows={newRows}
          setNewRows={setNewRows}
          isRec={true}
          setTriggerRefreshToken={setTriggerRefreshToken}
        />
      </div>
      <div
        className="recsContainer"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {getRecMovements.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() =>
                !deletedRows.map((item) => item.id).includes(item.id) &&
                setRowToEdit(item)
              }
              className={
                deletedRows.map((item) => item.id).includes(item.id)
                  ? "recurrence temporaryDelRow"
                  : "recurrence"
              }
              style={{
                display: deletedRows.map((item) => item.id).includes(item.id)
                  ? "none"
                  : "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                gap: "3rem",
                padding: "2rem",
                borderRadius: "5px",
                margin: "1rem",
                width: "17rem",
                cursor: "pointer",
              }}
            >
              <div
                className="recDetails"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".7rem",
                  fontWeight: "600",
                }}
              >
                <div
                  className="recTitles"
                  style={{
                    fontSize: "2rem",
                    maxWidth: "15rem",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    marginBottom: "1rem",
                  }}
                >
                  {item.lib}
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    color: item.value < 0 ? "var(--red)" : "var(--green)",
                  }}
                >
                  {Math.abs(item.value)} €
                </div>
                <div>Tous les {item.day}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
