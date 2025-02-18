import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import IIssue from "../models/Issue.js";
import { CREATE_ISSUE } from "../utils/mutations/issueMutations.js";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import "../styles/issue.css";

export const IssuePage = () => {
  const [issue, setIssue] = useState<IIssue>({ description: "" });
  const [createIssue] = useMutation(CREATE_ISSUE);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createIssue({ variables: { description: issue.description } });
      setError("Issue created successfully!");
      setIssue({ description: "" });
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container className="issue-page-container">
      <Form className="issue-form" onSubmit={handleFormSubmit}>
        <Form.Label htmlFor="description">Description</Form.Label>
        <InputGroup id="issue-description">
          <Form.Control
            as="textarea"
            name="description"
            placeholder="Enter issue description"
            value={issue.description}
            onChange={handleChange}
          />
        </InputGroup>
        {error && <p>{error}</p>}
        <Button className="button" id="issue-form-submit-button" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="m720-160-56-56 63-64H560v-80h167l-63-64 56-56 160 160-160 160ZM160-280q-33 0-56.5-23.5T80-360v-400q0-33 23.5-56.5T160-840h520q33 0 56.5 23.5T760-760v204q-10-2-20-3t-20-1q-10 0-20 .5t-20 2.5v-147L416-520 160-703v343h323q-2 10-2.5 20t-.5 20q0 10 1 20t3 20H160Zm58-480 198 142 204-142H218Zm-58 400v-400 400Z" />
          </svg>
        </Button>
      </Form>
    </Container>
  );
};

export default IssuePage;
