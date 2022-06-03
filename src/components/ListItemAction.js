// Components
import { Link } from "react-router-dom";

function ListItemAction(props) {
  return (
    <Link
      className="d-flex align-items-center p-2 btn-primary text-dark"
      to="/leave_game"
    >
      {props.action}
    </Link>
  );
}

export default ListItemAction;
