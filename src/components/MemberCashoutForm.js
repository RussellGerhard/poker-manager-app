// Components
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
// Hooks
import { useState, useEffect } from "react";

function MemberCashoutForm(props) {
  // State
  const [buyin, setBuyin] = useState(0);
  const [cashout, setCashout] = useState(0);
  const [useVenmo, setUseVenmo] = useState(false);

  // Constants
  const { players, setPlayers } = props.playerState;
  const { nonPlayers, setNonPlayers } = props.nonPlayerState;
  const { cashoutMap, setCashoutMap } = props.cashoutMapState;

  // Functions
  const toggleUseVenmoValue = () => {
    setUseVenmo(!useVenmo);
  };

  const onBuyinChange = (e) => {
    setBuyin(e.target.value);
  };

  const onCashoutChange = (e) => {
    setCashout(e.target.value);
  };

  const onClose = async () => {
    setPlayers(players.filter((player) => player !== props.player));
    setNonPlayers([...nonPlayers, props.player]);
    delete cashoutMap[props.player._id];
    setCashoutMap(cashoutMap);
  };

  // Effects
  useEffect(() => {
    cashoutMap[props.playerId] = {
      buyin: buyin,
      cashout: cashout,
      useVenmo: useVenmo,
    };
    setCashoutMap(cashoutMap);
  }, [buyin, cashout, useVenmo]);

  // Render
  return (
    <div className="my-2 d-flex flex-row justify-content-start align-items-start">
      <div className="position-relative flex-grow-1 d-flex flex-column align-items-start p-2 txt-lg border border-3 border-primary">
        <div className="w-100 d-flex flex-row justify-content-between flex-grow-1 mb-2">
          {props.player.username}
          <div>
            <Form.Label className="d-inline-block mx-2">Venmo</Form.Label>
            <Form.Check
              onChange={toggleUseVenmoValue}
              checked={useVenmo}
              className="d-inline-block"
            />
          </div>
        </div>
        <div className="w-100 d-flex flex-row justify-content-start align-items-center">
          <Form.Label className="me-2">In: </Form.Label>
          <Form.Control
            onChange={(e) => {
              onBuyinChange(e);
            }}
            style={{ width: "98px" }}
          />
          <Form.Label className="mx-2">Out: </Form.Label>
          <Form.Control
            onChange={(e) => {
              onCashoutChange(e);
            }}
            style={{ width: "98px" }}
          />
        </div>
      </div>
      <div
        className="align-self-stretch border border-3 border-start-0 border-primary"
        style={{ backgroundColor: "#2de2e6", width: "30px" }}
      >
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}

export default MemberCashoutForm;
