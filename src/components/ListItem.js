// Components
import { Link } from "react-router-dom";

// Customizable list item with label (can be link), text (cannot be link), and action (button)
function ListItem(props) {
  return (
    <div>
      <div
        className={`p-2 d-flex justify-content-between mt-2 border border-2 border-primary ${
          props.message ? "border-bottom-0" : ""
        }`}
      >
        <div style={{ width: "160px" }}>
          {props.isLink && (
            <Link
              className="txt-lg text-dark text-decoration-underline"
              to={props.linkTo}
            >
              {props.label}
            </Link>
          )}
          {!props.isLink && (
            <div className="txt-lg text-dark">{props.label}</div>
          )}
        </div>
        <div>
          {props.text && (
            <div
              className="txt-lg text-shadow"
              style={{
                color: props.textColor,
              }}
            >
              {props.text}
            </div>
          )}
        </div>
        {props.action && (
          <Link
            className="d-flex px-3 align-items-center btn-primary text-dark"
            to={props.actionTo}
            state={props.actionState}
          >
            {props.action}
          </Link>
        )}
      </div>
      {props.message && (
        <div className="px-2 pb-2 border border-top-0 border-2 border-primary">
          {props.message}
        </div>
      )}
    </div>
  );
}

export default ListItem;
