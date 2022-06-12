// Imports
import he from "he";
// Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/esm/Container";
import ListItem from "./ListItem";
import Alert from "./Alert";
// Hooks
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function Game() {
  // Refs
  const messageBoardEnd = useRef(null);
  const messageInput = useRef(null);

  // State
  const [game, setGame] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);
  const [errors, setErrors] = useState([]);
  const [messageErrors, setMessageErrors] = useState([]);
  const [editingMessage, setEditingMessage] = useState(false);
  const [editingLeaderboard, setEditingLeaderboard] = useState(false);
  const [disablePostMessage, setDisablePostMessage] = useState(false);

  // Location state
  const { state } = useLocation();

  // Context
  const { user } = useAuthContext();

  // Constants
  const locale =
    navigator.languages.length === 0 ? "en-US" : navigator.languages[0];
  const navigate = useNavigate();
  const params = useParams();

  // Functions
  async function fetchPosts() {
    const result = await fetch(
      `http://localhost:3001/api/posts/${params.gameId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const res = await result.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setPosts(res.posts);
    }
  }

  async function postMessage(e) {
    e.preventDefault();

    setDisablePostMessage(true);

    const response = await fetch("http://localhost:3001/api/new_message", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: params.gameId,
        message: messageInput.current.value,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setMessageErrors(res.errors);
    } else {
      setEditingMessage(false);
      fetchPosts();
    }
    setDisablePostMessage(false);
  }

  function navEditGame() {
    navigate("/edit_game", { state: { game: game } });
  }

  function navAddMember() {
    navigate("/add_member", { state: { game: game } });
  }

  // Effects
  // Autoscroll and autofocus on message create
  useEffect(() => {
    if (editingMessage || messageErrors.length !== 0) {
      if (messageInput.current) {
        messageInput.current.focus();
      }
      messageBoardEnd.current.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [editingMessage, messageErrors]);

  // Fetch game data and posts
  useEffect(() => {
    async function fetchGame() {
      const result = await fetch(
        `http://localhost:3001/api/games/${params.gameId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const res = await result.json();

      if (res.status === "error") {
        setErrors(res.errors);
      } else {
        setGame(res.game);
        setIsAdmin(res.isAdmin);
      }
    }

    fetchPosts();
    fetchGame();
  }, []);

  // JSX
  const alertList = state
    ? state.alerts.map((alert) => (
        <Alert key={alert.key} warning={false} message={alert.message} />
      ))
    : "";

  const errorList = errors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  const messageErrorList = messageErrors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  const memberList = game
    ? game.members.map((member) => {
        const profit = parseInt(game.member_profit_map[member._id]);
        var profit_color;
        if (profit > 0) {
          profit_color = "green";
        } else if (profit < 0) {
          profit_color = "red";
        } else {
          profit_color = "cyan";
        }
        return (
          <ListItem
            key={member._id}
            label={member.username}
            text={`$${profit}`}
            textColor={profit_color}
            shadow={true}
            action={
              isAdmin ? (user.username === member.username ? "" : "Kick") : ""
            }
            actionTo={
              isAdmin
                ? user.username === member.username
                  ? null
                  : "/kick_member"
                : null
            }
            actionState={{
              gameId: game._id,
              userId: member._id,
              endpoint: "kick_member",
              nav_dest: `/games/${game._id}`,
            }}
          />
        );
      })
    : "";

  const postList = posts
    ? posts.map((post) => {
        const delete_auth = user._id === post.author._id || isAdmin;
        const date = Date.parse(post.date);
        const formatted_date = new Intl.DateTimeFormat(locale, {
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
        }).format(date);
        return (
          <ListItem
            key={post._id}
            label={post.author.username}
            text={formatted_date}
            textColor="black"
            smallText={true}
            message={he.decode(post.body)}
            action={delete_auth ? "Delete" : null}
            apiCallback={
              delete_auth
                ? async function () {
                    const response = await fetch(
                      "http://localhost:3001/api/delete_message",
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          gameId: params.gameId,
                          postId: post._id,
                        }),
                      }
                    );

                    const res = await response.json();

                    if (res.status === "error") {
                      setMessageErrors(res.errors);
                      return;
                    } else {
                      fetchPosts();
                    }
                  }
                : null
            }
          />
        );
      })
    : "";

  // Render
  return (
    <>
      {alertList}
      {errorList}
      <h1 className="mt-4 text-primary text-center">
        {game && he.decode(game.name)}
      </h1>
      <div className="responsive-container d-flex flex-wrap justify-content-center align-items-start">
        <div className="d-flex flex-column">
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center mb-3">Details</h3>
            <div className="text-center border border-2 border-primary">
              {game && <div>{he.decode(game?.game_type)}</div>}
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
                  Log Session Results
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
                {editingLeaderboard ? (
                  <Button className="w-100 mb-2 btn-primary border-0">
                    Save Leaderboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingLeaderboard(true);
                    }}
                    className="w-100 btn-primary border-0"
                  >
                    Edit Leaderboard
                  </Button>
                )}
              </>
            )}
          </div>
        </Container>
        {messageErrorList}
        <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Message Board</h3>
          {postList.length === 0 ? (
            <ListItem label="No posts yet!" />
          ) : (
            postList
          )}
          {editingMessage ? (
            <Form onSubmit={postMessage}>
              <Form.Group className="mt-4 position-relative">
                <Form.Control
                  ref={messageInput}
                  className="p-3 no-scrollbar"
                  as="textarea"
                  rows={2}
                ></Form.Control>
                <CloseButton
                  onClick={() => {
                    setEditingMessage(false);
                  }}
                  className="position-absolute top-0 end-0"
                />
                <Button
                  type="submit"
                  className="w-100 mt-3 btn-primary border-0"
                  disabled={disablePostMessage}
                >
                  Post Message
                </Button>
              </Form.Group>
            </Form>
          ) : (
            <Button
              onClick={() => {
                setEditingMessage(true);
              }}
              className="w-100 mt-2 btn-primary border-0"
            >
              New Message
            </Button>
          )}
          <div ref={messageBoardEnd} />
        </Container>
      </div>
    </>
  );
}

export default Game;
