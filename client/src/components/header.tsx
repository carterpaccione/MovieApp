import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../utils/auth";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../styles/header.css";

export interface ImportMeta {
  env: {
    VITE_API_BASE_URL: string;
  };
}

const Header = () => {
  const token = AuthService.loggedIn();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const apiURL = (import.meta as unknown as ImportMeta).env.VITE_API_BASE_URL;

  const handleSearch = async (query: string) => {
    const mutatedQuery = query.split(" ").join("+");
    try {
      const response = await fetch(
        `${apiURL}/api/movies/search?query=${mutatedQuery}`
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
          <Button 
          className="button"
          onClick={() => handleSearch(query)}>Search</Button>
        </Form>
        <Nav>
          <Nav.Link href="/discover" className="nav-item">Discover</Nav.Link>
          {token ? <Nav.Link href="/me" className="nav-item">My Profile</Nav.Link> : null}
          {token ? (
            <Nav.Link href="/" className="nav-item" onClick={AuthService.logout}>
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link href="/" className="nav-item">Login / Sign Up</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
