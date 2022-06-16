// Components
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

// Customizable list item with label (can be link), text (cannot be link), and action (button)
// If action is a link, then actionTo is the destination
// If action is an API call, then apiActionCallback is called
function ListItem(props) {
  const borderVariant = props.borderVariant
    ? props.borderVariant
    : "border-primary";
  return (
    <>
      <div className={`my-2 border shadow border-3 ${borderVariant}`}>
        <div
          className={`p-2 d-flex justify-content-between mt-2 ${
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
                className={`txt-lg ${props.textShadow ? "text-shadow" : ""} ${
                  props.smallText ? "txt-md" : ""
                }`}
                style={{
                  color: props.textColor,
                }}
              >
                {props.text}
              </div>
            )}
          </div>
        </div>
        {props.message && <div className="px-2 pb-2 ">{props.message}</div>}
        <div className="p-1">
          {props.actionTo && (
            <Link
              className="d-flex p-0 px-3 align-items-center btn-primary text-dark rounded-0"
              to={props.actionTo}
              state={props.actionState}
            >
              {props.action}
            </Link>
          )}
          {props.apiCallback && (
            <Button
              onClick={props.apiCallback}
              className="d-flex w-100 p-0 px-3 align-items-center btn-primary text-dark border-0 rounded-0"
            >
              {props.action}
            </Button>
          )}
        </div>
        <div className={`p-1 pt-0 ${props.secondAction ? "" : "d-none"}`}>
          {props.secondActionTo && (
            <Link
              className="d-flex p-0 px-3 align-items-center btn-primary text-dark rounded-0"
              to={props.secondActionTo}
              state={props.secondActionState}
            >
              {props.secondAction}
            </Link>
          )}
          {props.secondApiCallback && (
            <Button
              onClick={props.secondApiCallback}
              className="d-flex w-100 p-0 px-3 align-items-center btn-primary text-dark border-0 rounded-0"
            >
              {props.secondAction}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default ListItem;
