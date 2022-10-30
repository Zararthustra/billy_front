import { useDispatch } from "react-redux";
import bg from "../assets/background.png";
import { deleteSummary } from "../redux/summarySlice";

export const ConfirmDelete = ({
  summaryId,
  setIsDeleting,
  setTriggerToaster,
  monthToDelete,
}) => {
  //___________________________________________________ Variables

  const dispatch = useDispatch();

  //___________________________________________________ Functions

  const confirmDelete = () => {
    dispatch(deleteSummary(summaryId))
      .then((user) => {
        setIsDeleting(false);
        if (user.meta.requestStatus === "rejected")
          return setTriggerToaster({
            type: "error",
            message: "Une erreur est survenue.",
          });
        return setTriggerToaster({
          type: "success",
          message: "Mois supprimé avec succès !",
        });
      })
      .catch((error) => console.log(error));
  };

  //___________________________________________________ Render

  return (
    <>
      <div className="editRowPage">
        <div
          className="editRowContainer"
          style={{
            background: `top no-repeat url(${bg})`,
            alignItems: "center",
            textAlign: "center",
            width: "35rem",
          }}
        >
          <h1
            style={{
              color: "var(--mauve)",
              fontSize: "3rem",
              margin: "1rem 0 3rem",
            }}
          >
            Êtes-vous sûr ?
          </h1>
          <p>
            Vous êtes sur le point de{" "}
            <strong>
              supprimer le mois{" "}
              {["a", "e", "i", "o", "u", "y"].includes(
                monthToDelete[0].toLowerCase()
              )
                ? "d'"
                : "de "}
              {monthToDelete}.
            </strong>
          </p>
          <button className="primaryButton" onClick={confirmDelete}>
            Oui
          </button>
          <button
            className="secondaryButton"
            onClick={() => setIsDeleting(false)}
            style={{
              color: "var(--mauve)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              marginTop: "2rem",
            }}
          >
            Non
          </button>
        </div>
      </div>
    </>
  );
};
