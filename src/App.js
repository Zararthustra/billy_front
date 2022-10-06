import { Summary } from "./Summary";
import { Month } from "./Month";
import { NotFound } from "./NotFound";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Summary />} />
          <Route path="/:year/:month" element={<Month />} />
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
