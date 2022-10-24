import { useDispatch } from "react-redux";
import { refreshTokenUser } from "../redux/userSlice";
import { getLocalStorage, saveLocalStorage } from "../utils/localStorage";
import bg from "../assets/background.png";
export const Reconnect = () => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const username = getLocalStorage("username");

  //___________________________________________________ Functions
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const reconnect = () => {
    dispatch(
      refreshTokenUser({
        refresh: getLocalStorage("refresh"),
      })
    )
      .then((user) => {
        if (user.meta.requestStatus === "rejected") return console.log("401"); //localStorage.clear(); // 401 toaster
        saveLocalStorage("username", username);
        saveLocalStorage("access", user.payload.access);
        saveLocalStorage("refresh", user.payload.refresh);
        window.location.reload();
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
            Session expirée
          </h1>
          <p
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              fontSize: "1.5rem",
              padding: "1rem",
              fontFamily: "var(--num-font)",
            }}
          >
            Veuillez vous reconnecter en tant{" "}
            {["a", "e", "i", "o", "u", "y"].includes(username[0].toLowerCase())
              ? "qu'"
              : "que "}
            <span style={{ color: "var(--mauve)", fontWeight: "600" }}>
              {username}
            </span>{" "}
            ou changer d'utilisateur.
          </p>
          <button className="primaryButton" onClick={reconnect}>
            Se reconnecter
          </button>
          <button
            className="secondaryButton"
            onClick={logout}
            style={{ color: "var(--mauve)", 
            backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            marginTop: "2rem" }}
          >
            Changer d'utilisateur
          </button>
        </div>
      </div>
    </>
  );
};
