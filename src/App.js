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
import PageNotFound from "./components/PageNotFound";
// Contexts
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  // Last path is for 404 since nothing else matched
  // AuthContext.Provider wrapper makes userId available to all components
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" exact element={<Index />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
