// Components
import CloseButton from "react-bootstrap/CloseButton";
// Hooks
import { useRef } from "react";

function Alert(props) {
  const alert = useRef(null);

  return (
    <div className="position-relative" ref={alert}>
      <div
        className={`${
          props.warning
            ? "bg-warning bd-warning-fuzz"
            : "bg-primary bd-primary-fuzz"
        } my-4 p-3 rounded text-center`}
      >
        {props.message}
      </div>
      <CloseButton
        onClick={props.onClose}
        className="position-absolute top-0 end-0"
      />
    </div>
  );
}

export default Alert;
