// Components
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

function MemberCashoutForm(props) {
  // Constants
  const { players, setPlayers } = props.playerState;
  const { nonPlayers, setNonPlayers } = props.nonPlayerState;

  // Function
  const onClose = async () => {
    setPlayers(players.filter((player) => player !== props.player));
    setNonPlayers([...nonPlayers, props.player]);
  };

  // Render
  return (
    <div className="d-flex flex-row justify-content-start align-items-start">
      <div className="position-relative flex-grow-1 d-flex align-items-start p-2 my-2 txt-lg border border-3 border-primary">
        <div className="flex-grow-1">{props.player.username}</div>
        <div className="d-flex flex-column mx-2">
          <Form.Label>In: </Form.Label>
          <Form.Label>Out: </Form.Label>
        </div>
        <div className="d-flex flex-column ">
          <Form.Control style={{ width: "75px" }} className="mb-1" />
          <Form.Control style={{ width: "75px" }} />
        </div>
      </div>
      <div className="my-2" style={{ width: "25px" }}>
        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}

export default MemberCashoutForm;
