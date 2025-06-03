import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import { Button, Stack } from "@mui/material";

import Shift from "./pages/Shift";
import Crew from "./pages/Crew";
import Maintenance from "./pages/Maintenance";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Shift />} />
        <Route path="/shift" element={<Shift />} />
        <Route path="/crew" element={<Crew />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
  );
};

export default App;
