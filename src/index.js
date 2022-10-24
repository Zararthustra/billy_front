import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./Login.css";
import "./Summary.css";
import "./Month.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
// import { retrieveSummary } from "./redux/summarySlice";
// import { retrieveMovements } from "./redux/movementSlice";


// store.dispatch(retrieveSummary());
// store.dispatch(retrieveMovements());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
