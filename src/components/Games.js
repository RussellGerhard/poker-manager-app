// Imports
import he from "he";
// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ListItem from "./ListItem";
import Loading from "./Loading";
// Hooks
import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";

function Games() {
  // State
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Context
  const { user } = useAuthContext();
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  function goToCreateGame() {
    navigate("/create_game");
  }
  // Effects
  useEffect(() => {
    // Fetch all games for current user
    async function fetchGames() {
      const result = await fetch("http://localhost:3001/api/games/", {
        method: "GET",
        credentials: "include",
      });

      const res = await result.json();

      if (res.status === "error") {
        setErrors(res.errors);
        return;
      }

      const BORDER_RSVP_MAP = {
        accepted: "border-success",
        declined: "border-dark",
        invited: "border-warning",
        uninvited: "border-primary",
      };

      // Map games to a listing of games that includes user profit for each game
      if (res.games) {
        const games = res.games.map((game) => {
          // Get profit and style based on value
          const profit = Number(game.profit).toFixed(2);
          const profit_disp =
            profit >= 0 ? `$${profit}` : `-$${Math.abs(profit).toFixed(2)}`;
          const profit_color =
            profit == 0 ? "cyan" : profit > 0 ? "#66ff00" : "#ff3131";

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
              text={profit_disp}
              textColor={profit_color}
              textShadow={true}
              borderVariant={BORDER_RSVP_MAP[game.session?.rsvp_map[user._id]]}
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
      setLoading(false);
    }
    fetchGames();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  // Render
  return loading ? (
    <Loading />
  ) : (
    <Container className="w-360px my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Games</h3>
      {gameList.length === 0 ? <ListItem label="No games yet!" /> : gameList}
      <div className="mt-3">
        Status: &nbsp;
        <span className="bg-primary rounded">No Info</span>&nbsp;
        <span className="bg-success rounded">RSVPed</span>&nbsp;
        <span className="bg-warning rounded">Pending</span>&nbsp;
        <span className="bg-dark rounded" style={{ color: "white" }}>
          Can't Come
        </span>
        &nbsp;
      </div>
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
