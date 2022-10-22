import { Home } from "./components/Home";
import { Logout } from "./components/Logout";
import { useDispatch, useSelector } from "react-redux";
// import { createMovements } from "./redux/movementSlice";

export const Recurrences = () => {
  //___________________________________________________ Variables

  const dispatch = useDispatch();

  // const getSummary = useSelector((state) => state.summary.summary);
  const getRecMovements = useSelector(
    (state) => state.movements.movements
  ).filter((item) => item.rec);

  //___________________________________________________ Functions

  const goRecs = () => {};

  //___________________________________________________ Render
  return (
    <main className="monthPage">
      <Home />
      <Logout />
      <div className="monthHead">
        <h1>Récurrences</h1>
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
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                gap: "3rem",
                padding: "2rem",
                borderRadius: "5px",
                border: "1px solid var(--mauve)",
                boxShadow: "0 0 100px #4a005815",
                marginTop: "2rem",
                maxWidth: "20rem",
                height: "15rem",
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
                  style={{
                    fontSize: "2rem",
                    maxWidth: "20rem",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    color: "var(--orange)",
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
              <div
                className="recActions"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  className="primaryButton"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0",
                  }}
                >
                  Modifier
                </div>
                <div className="secondaryButton">Supprimer</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
