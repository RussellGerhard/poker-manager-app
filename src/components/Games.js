// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import GameListItem from "./GameListItem";
import { Navigate } from "react-router-dom";
// Hooks
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Games() {
  // Set up state
  const [games, setGames] = useState(null);

  // Set up nav so we can use hook in handler
  const navigate = useNavigate();

  // AuthContext
  const { loading, user } = useAuthContext();

  // Get games for this user with API call
  useEffect(() => {
    async function loadGames(userId) {
      const response = await fetch(
        `http://localhost:3001/api/games/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const res = await response.json();

      setGames(res.games);
    }

    if (user) {
      loadGames(user._id);
    }
  }, [user]);

  // Get location state to display alerts
  const { state } = useLocation();

  // Create alert element
  if (state) {
    if (state.alertCreateGameSuccess) {
      var createGameSuccessMessage = (
        <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
          Game created successfully!
        </div>
      );
    }
  }

  // Create game list element
  console.log("user", user);
  console.log("games", games);
  const game_list = user
    ? games.map((game) => <GameListItem name="hello" />)
    : "";

  // Function to handle create game navigation
  function goToCreateGame() {
    navigate("/create_game");
  }

  // Wait for context provider to load value
  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate to="/login" state={{ alertNoAuth: true }} replace={true} />
    );
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        {createGameSuccessMessage}
        <div className="responsive-container">
          <Container className="w-360px my-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Games</h3>
            {game_list}
            <Button
              onClick={goToCreateGame}
              id="create-game-button"
              className="w-100 my-2"
            >
              Create Game
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Games;
