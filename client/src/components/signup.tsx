import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useMutation } from "@apollo/client";

import AuthService from "../utils/auth";
import { ADD_USER } from "../utils/mutations/userMutations";

import "../styles/homeForm.css";

const Login = () => {
  const [signUp] = useMutation(ADD_USER);

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
    if (signUpForm.password !== signUpForm.confirmPassword) {
      console.log("Passwords do not match.");
      return;
    }
    const input = { 
        username: signUpForm.username,
        email: signUpForm.email,
        password: signUpForm.password,
    }
    try {
      const { data } = await signUp({ variables: { input: input } });
      console.log(data.addUser.user);
      AuthService.login(data.addUser.token, { ...data.addUser.user });
    } catch (error: any) {
      console.log(error.message);
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
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button 
      className="button"
      variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default Login;
