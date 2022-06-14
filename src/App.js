// Imports
import "./css/custom.css";
import "./App.css";
// Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlertErrorWrapper from "./components/AlertErrorWrapper";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Index from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Profile from "./components/Profile";
import ChangeUsername from "./components/ChangeUsername";
import ChangePassword from "./components/ChangePassword";
import ChangeEmail from "./components/ChangeEmail";
import FinalWarning from "./components/FinalWarning";
import Games from "./components/Games";
import GameForm from "./components/GameForm";
import SessionForm from "./components/SessionForm";
import Game from "./components/Game";
import AddMember from "./components/AddMember";
import PageNotFound from "./components/PageNotFound";
// Contexts
import { AuthContextProvider } from "./contexts/AuthContext";
import { ErrorContextProvider } from "./contexts/ErrorContext";
import { AlertContextProvider } from "./contexts/AlertContext";

function App() {
  // Last path is for 404 (if nothing else matches, URL is not found)
  // AuthContextProvider wrapper makes user available to all components
  return (
    <AuthContextProvider>
      <ErrorContextProvider>
        <AlertContextProvider>
          <Router>
            <Header />
            <AlertErrorWrapper>
              <Routes>
                <Route path="" exact element={<Index />} />
                <Route path="login" exact element={<LogIn />} />
                <Route path="signup" exact element={<SignUp />} />
                <Route
                  path="profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="change_username"
                  element={
                    <PrivateRoute>
                      <ChangeUsername />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="change_password"
                  element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="change_email"
                  element={
                    <PrivateRoute>
                      <ChangeEmail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="delete_account"
                  element={
                    <PrivateRoute>
                      <FinalWarning
                        title="Delete Account"
                        message="Are you sure you want to delete your account? If you are the admin of any games, they will be deleted as well."
                        bold="This action cannot be undone"
                        action="Delete Account"
                        actionTo="/"
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="games"
                  exact
                  element={
                    <PrivateRoute>
                      <Games />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="leave_game"
                  element={
                    <PrivateRoute>
                      <FinalWarning
                        title="Leave Game"
                        message="Your leaderboard status will be deleted and you will need an invitation to join again, are you sure you want to leave?"
                        bold="This action cannot be undone"
                        action="Leave Game"
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="delete_game"
                  element={
                    <PrivateRoute>
                      <FinalWarning
                        title="Delete Game"
                        message="You are the admin of this game, are you sure you want to permanently delete it?"
                        bold="This action cannot be undone"
                        action="Delete Game"
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="kick_member"
                  element={
                    <PrivateRoute>
                      <FinalWarning
                        title="Kick Member"
                        message="Removing this member will delete their profit history and they will need an invitation to join again, are you sure you want to kick them?"
                        bold="This action cannot be undone"
                        action="Kick"
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="games/:gameId"
                  exact
                  element={
                    <PrivateRoute>
                      <Game />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="create_game"
                  exact
                  element={
                    <PrivateRoute>
                      <GameForm action="create" />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="edit_game"
                  exact
                  element={
                    <PrivateRoute>
                      <GameForm action="edit" />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="create_session"
                  exact
                  element={
                    <PrivateRoute>
                      <SessionForm action="create" />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="edit_session"
                  exact
                  element={
                    <PrivateRoute>
                      <SessionForm action="edit" />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="add_member"
                  exact
                  element={
                    <PrivateRoute>
                      <AddMember />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </AlertErrorWrapper>
          </Router>
        </AlertContextProvider>
      </ErrorContextProvider>
    </AuthContextProvider>
  );
}

export default App;
