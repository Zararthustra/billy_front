import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, getTokenUser } from "./redux/userSlice";
import { saveLocalStorage } from "./utils/localStorage";
import jwt_decode from "jwt-decode";
import { Toaster } from "./components/Toaster";

export const Login = ({ setIsAuth }) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [triggerToaster, setTriggerToaster] = useState(null);

  //___________________________________________________ Functions

  const handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        if (e.target.value.length > 10) return;
        return setName(e.target.value.trim().toLowerCase());
      case "password":
        if (e.target.value.length > 15) return;
        return setPassword(e.target.value.trim());
      default:
        break;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    dispatch(
      getTokenUser({
        username,
        password,
      })
    )
      .then((user) => {
        if (user.error?.message.split(" ").at(-1) === "401")
          return setTriggerToaster({
            type: "error",
            message: "Compte inconnu.",
          });
        const decoded = jwt_decode(user.payload.access);
        saveLocalStorage("username", username);
        saveLocalStorage("userid", decoded.user_id);
        saveLocalStorage("password", password);
        saveLocalStorage("access", user.payload.access);
        saveLocalStorage("refresh", user.payload.refresh);

        setIsAuth(true);
      })
      .catch((error) => console.log(error));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username)
      return setTriggerToaster({
        type: "error",
        message: "Veuillez entrer un nom de compte.",
      });
    if (!password)
      return setTriggerToaster({
        type: "error",
        message: "Veuillez entrer un mot de passe.",
      });

    dispatch(
      createUser({
        username,
        password,
      })
    )
      .then((res) => {
        if (res.error?.message.split(" ").at(-1) === "401")
          setTriggerToaster({
            type: "error",
            message: res.error?.message,
          });
        else if (res.error?.message.split(" ").at(-1) === "400")
          setTriggerToaster({
            type: "error",
            message: "Ce nom de compte existe déjà.",
          });
        else {
          setTriggerToaster({
            type: "success",
            message:
              'Votre compte a été créé avec succès ! Cliquez sur "Connexion" pour continuer.',
          });
        }
      })
      .catch((err) => console.log(err));
  };
  //___________________________________________________ Render
  return (
    <main className="loginPage">
      {triggerToaster && (
        <Toaster
          type={triggerToaster.type}
          message={triggerToaster.message}
          setTriggerToaster={setTriggerToaster}
        />
      )}
      <h1>Billy</h1>
      <form className="loginBubble" onSubmit={handleLogin}>
        <div className="inputLabel">
          <label htmlFor="username">Compte</label>
          <input
            required
            type="text"
            value={username}
            onChange={handleChange}
            name="username"
            id="username"
          />
        </div>
        <div className="inputLabel">
          <label htmlFor="password">Mot de passe</label>
          <input
            required
            type="password"
            value={password}
            onChange={handleChange}
            name="password"
            id="password"
          />
        </div>
        <input type="submit" className="primaryButton" value="Connexion" />
        <button
          className="secondaryButton"
          style={{ color: "white" }}
          onClick={handleRegister}
        >
          Créer un compte
        </button>
      </form>
    </main>
  );
};
