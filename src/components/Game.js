// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import ListItem from "./ListItem";
// Hooks

function Game() {
  // Dummy vars from api req
  const admin_test = true;

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>
        <h1 className="mt-4 text-primary text-center">My Game</h1>
        <div className="responsive-container d-flex flex-wrap justify-content-center align-items-start">
          <div className="d-flex flex-column">
            <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
              <h3 className="text-center">Details</h3>
              <div className="text-center">
                <div>No Limit Texas Hold'em</div>
                <div>0.10 / 0.20</div>
                <div>DATE</div>
                <div>TIME</div>
                <div>ADDRESS</div>
              </div>
              {admin_test && (
                <div className="mt-3">
                  <Button className="w-100 mb-2 btn-primary border-0">
                    Edit Details
                  </Button>
                  <Button className="w-100 btn-primary border-0">
                    Log Session
                  </Button>
                </div>
              )}
            </Container>
          </div>
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Members</h3>
            <ListItem
              label="Member 1"
              text="$100"
              textColor="green"
              action={admin_test ? "Kick" : ""}
              actionTo="/"
            />
            <ListItem
              label="Member 2"
              text="$50"
              textColor="green"
              action={admin_test ? "Kick" : ""}
              actionTo="/"
            />
            <ListItem
              label="Member 3"
              text="-$150"
              textColor="red"
              action={admin_test ? "Kick" : ""}
              actionTo="/"
            />
            <div className="mt-3">
              {admin_test && (
                <Button className="w-100 mb-2 btn-primary border-0">
                  Manage RSVPs
                </Button>
              )}
              {admin_test && (
                <Button className="w-100 mb-2 btn-primary border-0">
                  Add New Member
                </Button>
              )}
              {admin_test && (
                <Button className="w-100 btn-primary border-0">
                  Edit Leaderboard
                </Button>
              )}
            </div>
          </Container>
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Message Board</h3>
            <ListItem
              label="Member 2"
              action={admin_test ? "Delete" : ""}
              actionTo="/"
              message="Hey guys what the fuck is up? I'll be a litte late today. Catch you later Gs."
            />
            <ListItem
              label="Member 2"
              action={admin_test ? "Delete" : ""}
              actionTo="/"
              message="Hey guys what the fuck is up? I'll be a litte late today. Catch you later Gs."
            />
            <Button className="w-100 mt-3 btn-primary border-0">
              Post Message
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Game;
