import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { SEARCH_USERS } from "../utils/queries/userQueries.js";

import "../styles/userSearch.css";

export interface UserSearch {
  _id: string;
  username: string;
}

export const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, loading, error, refetch } = useQuery(SEARCH_USERS, {
    variables: { query: "" },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await refetch({ query: searchTerm });
  };

  const navigate = useNavigate();
  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
  };

  const renderUsers = (data: UserSearch[]) => {
    if (data.length === 0) {
      return <p>No Users Found</p>;
    }
    return data.map((user: UserSearch, index: number) => {
      return (
        <Card key={index} id="user-card">
          <Card.Body>
            <Card.Title>{user.username}</Card.Title>
            <Button
              className="button"
              onClick={() => handleUserNavigate(user._id)}
            >
              View
            </Button>
          </Card.Body>
        </Card>
      );
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <Container className="page-container">
      <h3>Search for Users</h3>
      <Row className="search-form">
        <Form onSubmit={handleFormSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Username..."
              onChange={handleInputChange}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Button className="button" variant="primary" type="submit">
            Search
          </Button>
        </Form>
      </Row>
      <Row>{renderUsers(data.searchUsers)}</Row>
    </Container>
  );
};

export default UserSearch;
