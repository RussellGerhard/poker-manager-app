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
    <div className="home-page-container m-3">
      <div className="d-flex flex-column align-items-center ">
        <div>
          <Container
            className="m-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg text-center"
            style={{ width: "360px" }}
          >
            <div className="m-3">
              <Logo width="200" />
            </div>
            <h1 className="text-center mb-3">Home Game</h1>
          </Container>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-around">
          <Container
            className="m-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg "
            style={{ width: "360px" }}
          >
            <h4 className="text-center mb-3">Game Admin Console</h4>
            <ul className="txt-md m-0 ">
              <li>Add Home Game users to your game</li>
              <li>Edit game information like stakes and max buy-in</li>
              <li>Invite game members to RSVP for poker sessions</li>
              <li>Determine who's coming at a glance</li>
              <li>Stay in touch by posting on your game's message board</li>
            </ul>
          </Container>
          <Container
            className="m-3 p-3 bg-pink bd-pink-fuzz rounded txt-lg"
            style={{ width: "360px" }}
          >
            <h4 className="text-center mb-3">Venmo-Enabled Cashout</h4>
            <ul className="txt-md m-0">
              <li>Use the session cashier to log cashouts</li>
              <li>
                Easily add members who forgot to RSVP or remove members who
                didn't show
              </li>
              <li>
                Optionally send members a Home Game notification with a custom
                Venmo link for their cashout request
              </li>
              <li>Auto-update the game's leaderboard on cashout</li>
            </ul>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Home;
