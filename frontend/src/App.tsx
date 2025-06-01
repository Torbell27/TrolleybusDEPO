import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/Navigation";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
