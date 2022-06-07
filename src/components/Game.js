// Imports
import he from "he";
// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import ListItem from "./ListItem";
// Hooks
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Game() {
  // State
  const [game, setGame] = useState(null);
  const [isAdmin, setIsAdmin] = useState([]);

  // Constants
  const navigate = useNavigate();
  const params = useParams();

  // Effects
  useEffect(() => {
    // Fetch game object
    async function fetchGame() {
      const result = await fetch(
        `http://localhost:3001/api/games/${params.gameId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const res = await result.json();

      setGame(res.game);
      setIsAdmin(res.isAdmin);
    }

    fetchGame();
  }, []);

  // Functions
  function navEditGame() {
    navigate("/edit_game", { state: { game: game } });
  }

  function navAddMember() {
    navigate("/add_member", { state: { game: game } });
  }

  // JSX
  const memberList = game
    ? game.members.map((member) => {
        const profit = parseInt(game.member_profit_map[member._id]);
        var profit_color;
        if (profit > 0) {
          profit_color = "green";
        } else if (profit < 0) {
          profit_color = "red";
        } else {
          profit_color = "white";
        }
        return (
          <ListItem
            key={member._id}
            label={member.username}
            text={`$${profit}`}
            textColor={profit_color}
            action={isAdmin ? "Kick" : ""}
            actionTo={isAdmin ? "/" : ""}
            actionState={{}}
          />
        );
      })
    : "";

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div>
        <h1 className="mt-4 text-primary text-center">
          {game ? game.name : ""}
        </h1>
        <div className="responsive-container d-flex flex-wrap justify-content-center align-items-start">
          <div className="d-flex flex-column">
            <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
              <h3 className="text-center mb-3">Details</h3>
              <div className="text-center">
                <div>{game?.game_type}</div>
                {game && <div>{he.decode(game?.stakes)}</div>}
                <div>{game?.date}</div>
                <div>{game?.time}</div>
                <div>{game?.address}</div>
              </div>
              {isAdmin && (
                <div className="mt-3">
                  <Button
                    onClick={navEditGame}
                    className="w-100 mb-2 btn-primary border-0"
                  >
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
            <h3 className="text-center mb-3">Members</h3>
            {memberList}
            <div className="mt-3">
              {isAdmin && (
                <>
                  <Button
                    onClick={navAddMember}
                    className="w-100 mb-2 btn-primary border-0"
                  >
                    Add Member
                  </Button>
                  <Button className="w-100 mb-2 btn-primary border-0">
                    Manage RSVPs
                  </Button>
                  <Button className="w-100 btn-primary border-0">
                    Edit Leaderboard
                  </Button>
                </>
              )}
            </div>
          </Container>
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center mb-3">Message Board</h3>
            <ListItem
              label="Member 2"
              action={isAdmin ? "Delete" : ""}
              actionTo="/"
              message="Hey guys what the fuck is up? I'll be a litte late today. Catch you later Gs."
            />
            <ListItem
              label="Member 2"
              action={isAdmin ? "Delete" : ""}
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
