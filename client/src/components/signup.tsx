import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useMutation } from "@apollo/client";

import AuthService from "../utils/auth";
import { validateNewUserInput } from "../utils/helper";
import { ADD_USER } from "../utils/mutations/userMutations";

import "../styles/homeForm.css";

const SignUp = () => {
  const [signUp] = useMutation(ADD_USER);
  const [errorMessage, setErrorMessage] = useState("");

  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm({
      ...signUpForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateNewUserInput(signUpForm) !== true) {
      const validationResult = validateNewUserInput(signUpForm);
      if (validationResult !== true) {
        setErrorMessage(validationResult);
        return;
      }
      return;
    }
    const input = {
      username: signUpForm.username,
      email: signUpForm.email,
      password: signUpForm.password,
    };
    try {
      const { data } = await signUp({ variables: { input: input } });
      AuthService.login(data.addUser.token, { ...data.addUser.user });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Form id="form-container" onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="text"
          placeholder="Enter email"
          id="cypress-signup-email"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          id="cypress-signup-username"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          id="cypress-signup-password"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          id="cypress-signup-confirm-password"
          onChange={handleInputChange}
        />
      </Form.Group>
      {errorMessage && <p id="errorMessage">{errorMessage}</p>}
      <Button className="button" id="home-form-submit-button" variant="primary" type="submit">
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

export default SignUp;
