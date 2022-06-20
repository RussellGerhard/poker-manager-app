// Components
import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import MemberCashoutForm from "./MemberCashoutForm";
// Hooks
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";

function SessionCashier() {
  // Refs
  const filterInput = useRef(null);

  // Location state
  const { state } = useLocation();
  const game = state.game;

  // State
  const [filterValue, setFilterValue] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [players, setPlayers] = useState(
    game.members.filter(
      (member) => game.session.rsvp_map[member._id] === "accepted"
    )
  );
  const [nonPlayers, setNonPlayers] = useState(
    game.members.filter(
      (member) => game.session.rsvp_map[member._id] !== "accepted"
    )
  );

  // Context
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  function handleDropdownClick(e, player) {
    setPlayers([...players, player]);
    setNonPlayers(nonPlayers.filter((nonPlayer) => nonPlayer !== player));
    setFilterValue("");
    filterInput.current.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const player_cashout_map = new Map();
    var buyin, cashout;
    for (var i = 0; i < players.length; i++) {
      // Close button counts in target array of form
      buyin = e.target[3 * i].value;
      cashout = e.target[3 * i + 1].value;

      // Make sure buyin and cashout are numbers
      if ((!+buyin && buyin !== "0") || (!+cashout && cashout !== "0")) {
        setErrors([
          {
            param: "InvalidNumber",
            msg: "In and out values must be a valid numbers",
          },
        ]);
        setDisableSubmit(false);
        return;
      }

      player_cashout_map[players[i]._id] = {
        in: buyin,
        out: cashout,
      };
    }
    setDisableSubmit(false);

    const response = await fetch("http://localhost:3001/api/submit_cashout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: game._id,
        players: players,
        player_cashout_map: player_cashout_map,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate(`/games/${game._id}`, {
        state: {
          alert: "Session cashout successful, leaderboard updated!",
        },
      });
    }
  }

  // JSX
  var dropdownList = nonPlayers
    .filter((nonPlayer) =>
      nonPlayer.username.toLowerCase().startsWith(filterValue.toLowerCase())
    )
    .sort((a, b) => {
      return b.username < a.username;
    })
    .map((nonPlayer) => {
      return (
        <Dropdown.Item
          onClick={(e) => {
            handleDropdownClick(e, nonPlayer);
          }}
          eventkey={nonPlayer._id}
          key={nonPlayer._id}
        >
          {nonPlayer.username}
        </Dropdown.Item>
      );
    });

  dropdownList = [
    <Form.Control
      ref={filterInput}
      autoFocus
      key="filter"
      className="m-2 w-auto"
      placeholder="Type to filter..."
      onChange={(e) => setFilterValue(e.target.value)}
      value={filterValue}
    />,
    ...dropdownList,
  ];

  const cashoutList = players.map((player) => {
    return (
      <MemberCashoutForm
        key={player._id}
        player={player}
        playerState={{ players, setPlayers }}
        nonPlayerState={{ nonPlayers, setNonPlayers }}
      />
    );
  });

  return (
    <>
      <h1 className="mt-4 text-primary text-center">Cashier</h1>
      <div className="d-fl1ex flex-wrap justify-content-center align-items-start">
        <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <Dropdown autoClose="outside">
            <Dropdown.Toggle className="w-100">Add Member</Dropdown.Toggle>
            <Dropdown.Menu className="w-100">{dropdownList}</Dropdown.Menu>
          </Dropdown>
        </Container>
        <Container className="w-360px flex-shrink-0 m-3 p-3 bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center mb-3">Session Cashout</h3>
          <Form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            {cashoutList}
            <Button
              type="submit"
              disabled={disableSubmit}
              className="w-100 mt-3 btn-primary border-0"
            >
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default SessionCashier;
