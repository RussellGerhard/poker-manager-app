// Components
import Container from "react-bootstrap/Container";
import Logo from "./Logo";
import Alert from "./Alert";
// Hooks
import { useLocation } from "react-router-dom";

function Home() {
  // Location state
  var { state } = useLocation();

  // state-based JSX
  const alertList = state
    ? state.alerts.map((alert) => {
        return (
          <Alert key={alert.key} warning={false} message={alert.message} />
        );
      })
    : "";

  return (
    <div className="mw-1200px">
      {alertList}
      <Logo className="mw-1200px" width="200" />
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
