// Imports
import he from "he";
// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListItem from "./ListItem";
// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function Games() {
  // State
  const [gameList, setGameList] = useState([]);

  // Context
  const { user } = useAuthContext();

  // Constants
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    // Fetch all games for current user
    async function fetchGames() {
      const result = await fetch("http://localhost:3001/api/games/", {
        method: "GET",
        credentials: "include",
      });
      const res = await result.json();

      // Map games to a listing of games that includes user profit for each game
      if (res.games) {
        const games = res.games.map((game) => {
          // Get profit and style based on value
          const profit = parseInt(game.member_profit_map[user._id]);

          // Determine if user is admin
          var action;
          var actionTo;
          var actionState;
          if (game.admin === user._id) {
            action = "Delete";
            actionTo = "/delete_game";
            actionState = {
              gameId: game._id,
              userId: null,
              endpoint: "delete_game",
              nav_dest: "/games",
            };
          } else {
            action = "Leave";
            actionTo = "/leave_game";
            actionState = {
              gameId: game._id,
              userId: null,
              endpoint: "leave_game",
              nav_dest: "/games",
            };
          }

          return (
            <ListItem
              key={game._id}
              label={he.decode(game.name)}
              text={`$${profit}`}
              textColor="cyan"
              shadow={true}
              isLink={true}
              linkTo={game.url}
              action={action}
              actionTo={actionTo}
              actionState={actionState}
            />
          );
        });
        setGameList(games);
      }
    }
    fetchGames();
  }, []);

  // Functions
  function goToCreateGame() {
    navigate("/create_game");
  }

  // Render
  return (
    <Container className="w-360px my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Games</h3>
      {gameList.length === 0 ? <ListItem label="No games yet!" /> : gameList}
      <Button
        onClick={goToCreateGame}
        id="create-game-button"
        className="w-100 mt-3"
      >
        Create Game
      </Button>
    </Container>
  );
}

export default Games;
