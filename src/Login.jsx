import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLocalStorage } from "./utils/localStorage";

export const Login = ({ setIsAuth }) => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  //___________________________________________________ Functions

  const handleChange = (e) => {
    switch (e.target.name) {
      case "account":
        return setAccount(e.target.value);
      case "password":
        return setPassword(e.target.value);
      default:
        break;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    saveLocalStorage("account", account);
    saveLocalStorage("password", password);
    setIsAuth(true);
    navigate('/')
  };

  //___________________________________________________ Render
  return (
    <main className="loginPage">
      <h1>Billy</h1>
      <form className="loginBubble" onSubmit={handleLogin}>
        <div className="inputLabel">
          <label htmlFor="account">Compte</label>
          <input
            required
            type="text"
            value={account}
            onChange={handleChange}
            name="account"
            id="account"
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
        <button className="secondaryButton">Créer un compte</button>
      </form>
    </main>
  );
};
