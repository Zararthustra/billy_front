import { Summary } from "./Summary";
import { Month } from "./Month";
import { NotFound } from "./NotFound";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Recurrences } from "./Recurrences";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { retrieveSummary } from "./redux/summarySlice";
// import { retrieveMovements } from "./redux/movementSlice";

function App() {
  //___________________________________________________ Variables

  // const dispatch = useDispatch();
  // const getSummaryStatus = useSelector((state) => state.summary.status);

  // //___________________________________________________ API Lifecycle

  // useEffect(() => {
  //   if (getSummaryStatus === "idle") {
  //     dispatch(retrieveSummary());
  //     dispatch(retrieveMovements());
  //   }
  // }, [getSummaryStatus, dispatch]);

  //___________________________________________________ Render

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/accueil" element={<Summary />} />
          <Route path="/:year/:month" element={<Month />} />
          <Route path="/recurrences" element={<Recurrences />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
