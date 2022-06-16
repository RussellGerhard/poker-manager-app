// Components
import Container from "react-bootstrap/Container";
import Logo from "./Logo";
// Hooks
import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";

function Home() {
  // Location state
  var { state } = useLocation();

  // Context
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Effects
  useLayoutEffect(() => {
    if (state) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  return (
    <div className="mw-1200px">
      <Logo width="200" />
      <Container className="my-3 p-3 mw-1200px bg-pink bd-pink-fuzz rounded txt-lg text-center">
        <div>
          HomeGame is a hub for you and your friends to organize poker games.
        </div>
        <div>
          Create a game to get started managing invites and keeping track of
          results!
        </div>
      </Container>
    </div>
  );
}

export default Home;
