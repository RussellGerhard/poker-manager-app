import Container from "react-bootstrap/Container";
import LoginForm from "./LoginForm";
import Logo from "./Logo";

function LoginPage() {
  return (
    <div className="d-flex justify-content-center vh-100">
      <div className="align-self-center">
        <Container className="my-3 p-3 mw-360px bg-pink bd-pink-fuzz rounded">
          <Logo />
          <LoginForm />
        </Container>
        <Container className="my-4 p-2 mw-360px bg-pink bd-pink-fuzz rounded text-center">
          <div>Interested in signing up?</div>
          <div>
            <a href="TODO">Register Account</a>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default LoginPage;
