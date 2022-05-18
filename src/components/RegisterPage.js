import Container from "react-bootstrap/Container";
import RegisterForm from "./RegisterForm";
import Logo from "./Logo";

function RegisterPage() {
  return (
    <div className="d-flex justify-content-center vh-100">
      <div className="align-self-center">
        <Container className="my-3 p-3 mw-360px bg-pink bd-pink-fuzz rounded">
          <Logo />
          <RegisterForm />
        </Container>
        <Container className="my-4 p-2 mw-360px bg-pink bd-pink-fuzz rounded text-center">
          <div>Already have an account?</div>
          <div>
            <a href="TODO">Log In</a>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default RegisterPage;
