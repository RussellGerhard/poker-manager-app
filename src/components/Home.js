// Components
import Container from "react-bootstrap/Container";
import Logo from "./Logo";
// Hooks
import { useLocation } from "react-router-dom";

function Home() {
  // Location state
  var { state } = useLocation();

  if (state && state.alertAuth) {
    var alertAuth = (
      <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
        You are already logged in
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-1200px">
        {alertAuth}
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
    </div>
  );
}

export default Home;
