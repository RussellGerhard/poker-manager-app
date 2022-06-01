// Imports
import "./css/custom.css";
import "./App.css";
// Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile";
import Games from "./components/Games";
import PageNotFound from "./components/PageNotFound";
// Contexts
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  // Last path is for 404 since nothing else matched
  // AuthContextProvider wrapper makes user available to all components
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" exact element={<Index />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/games" exact element={<Games />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
