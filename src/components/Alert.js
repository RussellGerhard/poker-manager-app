function Alert(props) {
  return (
    <div
      className={`${
        props.warning
          ? "bg-warning bd-warning-fuzz"
          : "bg-primary bd-primary-fuzz"
      } my-4 p-3 rounded text-center`}
    >
      {props.message}
    </div>
  );
}

export default Alert;
