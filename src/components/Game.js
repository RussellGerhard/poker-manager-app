// Imports
import he from "he";
// Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/esm/Container";
import ListItem from "./ListItem";
import Loading from "./Loading";
// Hooks
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";

function Game() {
  // Location state
  const { state } = useLocation();

  // Refs
  const messageBoardEnd = useRef(null);
  const messageInput = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState([]);
  const [editingMessage, setEditingMessage] = useState(false);
  const [editingLeaderboard, setEditingLeaderboard] = useState(false);
  const [disablePostMessage, setDisablePostMessage] = useState(false);

  // Context
  const { user } = useAuthContext();
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Constants
  const locale =
    navigator.languages.length === 0 ? "en-US" : navigator.languages[0];
  const navigate = useNavigate();
  const params = useParams();

  // Functions
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
      setSession(res.game.session);
      setIsAdmin(res.isAdmin);
    }
  }

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
    // This is called last in the effect, so loading ends here
    setLoading(false);
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
      setErrors(res.errors);
    } else {
      setEditingMessage(false);
      fetchPosts();
    }
    setDisablePostMessage(false);
  }

  function navEditGame() {
    navigate("/edit_game", { state: { game: game } });
  }

  function navEditSession() {
    navigate("/edit_session", { state: { game: game } });
  }

  // Navigates to final warning
  function navDeleteSession() {
    navigate("/delete_session", {
      state: {
        gameId: game._id,
        userId: null,
        endpoint: "delete_session",
        nav_dest: `/games/${game._id}`,
      },
    });
  }

  function navCreateSession() {
    navigate("/create_session", { state: { game: game } });
  }

  function navSessionCashier() {
    navigate("/session_cashier", { state: { game: game } });
  }

  function navAddMember() {
    navigate("/add_member", { state: { game: game } });
  }

  async function postProfit(e, memberId) {
    e.preventDefault();

    const profit = e.target[0].value;

    // Check that profit is valid number
    if (!+profit && profit !== "0") {
      setErrors([{ msg: "Profit must be a valid number" }]);
      return;
    }

    const response = await fetch("http://localhost:3001/api/update_profit", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: params.gameId,
        memberId: memberId,
        profit: profit,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      fetchGame();
    }
  }

  async function joinSession(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/join_session", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: params.gameId,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      fetchGame();
    }
  }

  async function leaveSession(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/leave_session", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: params.gameId,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      fetchGame();
    }
  }

  async function inviteMemberRSVP(e, memberId) {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/send_rsvp_invite", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: params.gameId,
        memberId: memberId,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      fetchGame();
    }
  }

  async function removeMemberRSVP(e, memberId) {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:3001/api/remove_session_member",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: params.gameId,
          memberId: memberId,
        }),
      }
    );

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      fetchGame();
    }
  }

  // Effects
  // Autoscroll and autofocus on message create
  useEffect(() => {
    if (editingMessage) {
      if (messageInput.current) {
        messageInput.current.focus();
      }
      messageBoardEnd.current.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [editingMessage]);

  // Fetch game data and posts
  useEffect(() => {
    // This order matters: loading ends after posts are loaded
    fetchGame();
    fetchPosts();
  }, []);

  useLayoutEffect(() => {
    if (state && state.alert) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  // JSX
  const BORDER_RSVP_MAP = {
    accepted: "border-success",
    declined: "border-dark",
    invited: "border-warning",
    uninvited: "border-primary",
  };

  const memberList = game
    ? game.members.map((member) => {
        const profit = Number(game.member_profit_map[member._id]).toFixed(2);
        const profit_disp =
          profit >= 0 ? `$${profit}` : `-$${Math.abs(profit).toFixed(2)}`;
        const profit_color =
          profit == 0 ? "cyan" : profit > 0 ? "#66ff00" : "#ff3131";

        var secondAction;
        var secondApiCallback;
        const rsvp_status = game.session?.rsvp_map[member._id];
        if (game.session) {
          if (user._id === member._id) {
            if (rsvp_status === "accepted") {
              secondAction = "Leave Session";
              secondApiCallback = (e) => {
                leaveSession(e);
              };
            } else if (rsvp_status === "invited" || isAdmin) {
              secondAction = "Join Session";
              secondApiCallback = (e) => {
                joinSession(e);
              };
            }
          } else if (rsvp_status === "accepted" && isAdmin) {
            secondAction = "Remove from Session";
            secondApiCallback = (e) => {
              removeMemberRSVP(e, member._id);
            };
          } else if (rsvp_status === "invited" && isAdmin) {
            secondAction = "Invite to Session";
            secondApiCallback = (e) => {
              inviteMemberRSVP(e, member._id);
            };
          } else if (isAdmin) {
            secondAction = "Invite to Session";
            secondApiCallback = (e) => {
              inviteMemberRSVP(e, member._id);
            };
          }
        }

        return (
          <div key={member._id}>
            <ListItem
              label={member.username}
              text={profit_disp}
              textColor={profit_color}
              textShadow={true}
              borderVariant={
                BORDER_RSVP_MAP[game.session?.rsvp_map[member._id]]
              }
              action={
                isAdmin ? (user.username === member.username ? "" : "Kick") : ""
              }
              actionTo={
                isAdmin
                  ? user.username === member.username
                    ? null
                    : "/kick_member"
                  : ""
              }
              actionState={{
                gameId: game._id,
                userId: member._id,
                endpoint: "kick_member",
                nav_dest: `/games/${game._id}`,
              }}
              secondAction={secondAction}
              secondApiCallback={secondApiCallback}
            />
            {editingLeaderboard ? (
              <Form
                onSubmit={(e) => {
                  postProfit(e, member._id);
                }}
                className="d-flex align-items-center mb-3 border-left border-2 border-primary"
              >
                <Form.Label className="txt-lg pt-1 px-2 w-75">
                  Set Profit:
                </Form.Label>
                <Form.Control className="mx-2" />
                <Button type="submit" className="w-25">
                  Set
                </Button>
              </Form>
            ) : null}
          </div>
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
                      setErrors(res.errors);
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

  // Game details
  const gameDetails =
    game?.game_type || game?.stakes ? (
      <>
        <div>{he.decode(game?.game_type)}</div>
        <div>{he.decode(game?.stakes)}</div>
      </>
    ) : (
      <div>No details yet!</div>
    );

  // Session details
  const sessionDetails =
    session?.date || session?.time || session?.address ? (
      <>
        <div>{he.decode(game.session?.date)}</div>
        <div>{he.decode(game.session?.time)}</div>
        <div>{he.decode(game.session?.address)}</div>
      </>
    ) : (
      <div>No session yet!</div>
    );

  // Render
  return loading ? (
    <Loading />
  ) : (
    <div className="responsive-container">
      <h1 className="mt-4 text-primary text-center">
        {game && he.decode(game.name)}
      </h1>
      <div className="d-flex flex-wrap justify-content-center align-items-start">
        <div className="d-flex flex-wrap justify-content-center align-items-stretch">
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center mb-3">Game Details</h3>
            <div className="p-2 txt-lg text-center border border-3 border-primary">
              {gameDetails}
            </div>
            {isAdmin && (
              <div className="mt-3">
                <Button
                  onClick={navEditGame}
                  className="w-100 btn-primary border-0"
                >
                  Edit Details
                </Button>
              </div>
            )}
          </Container>
          <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center mb-3">Upcoming Session</h3>
            <div className="p-2 txt-lg text-center border border-3 border-primary">
              {sessionDetails}
            </div>
            <div className="mt-3">
              {isAdmin && (
                <>
                  {session ? (
                    <>
                      <Button
                        onClick={navEditSession}
                        className="w-100 mb-2 btn-primary border-0"
                      >
                        Edit Session
                      </Button>
                      <Button
                        onClick={navDeleteSession}
                        className="w-100 mb-2 btn-primary border-0"
                      >
                        Delete Session
                      </Button>
                      <Button
                        onClick={navSessionCashier}
                        className="w-100 btn-primary border-0"
                      >
                        Session Cashier
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={navCreateSession}
                      className="w-100 btn-primary border-0"
                    >
                      Create Session
                    </Button>
                  )}
                </>
              )}
            </div>
          </Container>
        </div>
        <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Members</h3>
          {memberList}
          {session && (
            <div>
              Status: &nbsp;
              <span className="bg-primary">No Info</span>&nbsp;
              <span className="bg-success">RSVPed</span>&nbsp;
              <span className="bg-warning">Pending</span>&nbsp;
              <span className="bg-dark" style={{ color: "white" }}>
                Can't Come
              </span>
              &nbsp;
            </div>
          )}
          <div className="mt-3">
            {isAdmin && (
              <>
                <Button
                  onClick={navAddMember}
                  className="w-100 mb-2 btn-primary border-0"
                >
                  Add Member
                </Button>
                {editingLeaderboard ? (
                  <Button
                    onClick={() => {
                      setEditingLeaderboard(false);
                    }}
                    className="w-100 btn-primary border-0"
                  >
                    Confirm Leaderboard
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
    </div>
  );
}

export default Game;
