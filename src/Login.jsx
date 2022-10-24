import { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, getTokenUser } from "./redux/userSlice";
import { saveLocalStorage } from "./utils/localStorage";
import jwt_decode from "jwt-decode";

export const Login = ({ setIsAuth }) => {
  //___________________________________________________ Variables
  const dispatch = useDispatch();

  const [username, setName] = useState("");
  const [password, setPassword] = useState("");

  //___________________________________________________ Functions

  const handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        return setName(e.target.value.trim());
      case "password":
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
        if (user.meta.requestStatus === "rejected") return; // 401 toaster
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
    dispatch(
      createUser({
        username,
        password,
      })
    ); // Toasters error & success
  };
  //___________________________________________________ Render
  return (
    <main className="loginPage">
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
        <button className="secondaryButton" style={{color: 'white'}} onClick={handleRegister}>
          Créer un compte
        </button>
      </form>
    </main>
  );
};
