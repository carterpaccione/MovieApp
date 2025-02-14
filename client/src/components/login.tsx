import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useMutation } from "@apollo/client";

import { LOGIN } from "../utils/mutations/userMutations";
import AuthService from "../utils/auth";

import "../styles/homeForm.css";

const Login = () => {
  const [login] = useMutation(LOGIN);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { input: loginForm } });
      AuthService.login(data.login.token, { ...data.login.user });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Form id="form-container" onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          id="cypress-login-username"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          id="cypress-login-password"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button className="button" id="home-form-submit-button" type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
      </Button>
    </Form>
  );
};

export default Login;
