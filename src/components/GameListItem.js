function GameListItem(props) {
  return (
    <a>
      <div className="d-flex justify-content-between p-2 my-2 border border-primary rounded">
        <div>{props.name}</div>
        <a>Leave</a>
      </div>
    </a>
  );
}

export default GameListItem;
