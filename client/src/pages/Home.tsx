import SignUp from "../components/signup.tsx";
import Login from "../components/login.js";
import { useState } from "react";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "../styles/home.css";

const Home = () => {
  const [formState, setFormState] = useState("login");

  return (
    <Container className="page-container">
      <Col id="home-content">
        <Row id="home-button-row">
          <Col>
            <Button className="button home-button" id="login-button" onClick={() => setFormState("login")}>Login</Button>
          </Col>
          <Col>
            <Button className="button home-button" id="signup-button" onClick={() => setFormState("signup")}>Sign Up</Button>
          </Col>
        </Row>
        <Row>{formState === "login" ? <Login /> : <SignUp />}</Row>
      </Col>
    </Container>
  );
};

export default Home;
