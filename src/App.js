// Imports
import "./css/custom.css";
import "./App.css";
// Router components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Dev components
import Header from "./components/Header";
import Index from "./components/Index";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import PageNotFound from "./components/PageNotFound";

function App() {
  // Last path is for 404 since nothing else matched
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" exact element={<Index />} />
        <Route path="/login" exact element={<LogIn />} />
        <Route path="/signup" exact element={<SignUp />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
