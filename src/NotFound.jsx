import { useNavigate } from "react-router-dom";
import notfoundgif from "./assets/notfound.gif";
import { Logout } from "./components/Logout";
import {Home} from "./components/Home"

export const NotFound = () => {
  //___________________________________________________ Variables
  const navigate = useNavigate();
  //___________________________________________________ Functions

  //___________________________________________________ Render
  return (
    <main className="notFound">
      <Home />
      <Logout />
      <h1>On s'est perdu ?</h1>
      <button className="primaryButton" onClick={() => navigate("/accueil")}>
        Retour à Accueil
      </button>
      <img src={notfoundgif} alt="Travolta gif" />
    </main>
  );
};
