import logo from "../images/pink-logo.png";

function Logo(props) {
  return (
    <div>
      <img
        src={logo}
        alt="Letter H Logo"
        className={`d-block w-${props.width}px mx-auto rounded`}
      ></img>
    </div>
  );
}

export default Logo;
