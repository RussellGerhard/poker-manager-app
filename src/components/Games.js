// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListItem from "./ListItem";
// Hooks
import { useNavigate } from "react-router-dom";

function Games() {
  // Set up nav so we can use hook in handler
  const navigate = useNavigate();

  // Function to handle create game navigation
  function goToCreateGame() {
    navigate("/create_game");
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        <Container className="w-360px my-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center">Games</h3>
          <ListItem
            label="My Game"
            isLink={true}
            linkTo="/games/62962f2e209b7325f97c6e05"
            action="Leave"
            actionTo="/"
          />
          <Button
            onClick={goToCreateGame}
            id="create-game-button"
            className="w-100 mt-3"
          >
            Create Game
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Games;
