import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../utils/auth";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/header.css";

interface ImportMeta {
  env: {
    REACT_APP_API_URL: string;
  };
}

const Header = () => {
  const token = AuthService.loggedIn();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const apiURL = (import.meta as unknown as ImportMeta).env.REACT_APP_API_URL;
  console.log("API URL:", apiURL);

  const handleSearch = async (query: string) => {
    const mutatedQuery = query.split(" ").join("+");
    try {
      const response = await fetch(
        `http://localhost:3001/api/movies/search?query=${mutatedQuery}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      navigate("/discover", { state: { movies: data.Search } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Navbar>
      <Container>
        <h1>Movie App</h1>
        <Form id="search-container">
          <Form.Control
            id="search-bar"
            size="lg"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button onClick={() => handleSearch(query)}>Search</Button>
        </Form>
        <Nav>
          <Nav.Link href="/discover">Discover</Nav.Link>
          {token ? <Nav.Link href="/me">My Profile</Nav.Link> : null}
          {token ? (
            <Nav.Link href="/" onClick={AuthService.logout}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link href="/">Login / Sign Up</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
