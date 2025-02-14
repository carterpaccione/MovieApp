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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
    setQuery("");
  };

  return (
    <Navbar>
      <Container>
        <h1>Movie App</h1>
        <Form id="search-container" onSubmit={handleFormSubmit}>
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
          <Button className="button" id="search-button" type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </Button>
        </Form>
        <Nav>
          <Nav.Link href="/discover" className="nav-item">
            Discover
          </Nav.Link>
          {token ? (
            <Nav.Link href="/me" className="nav-item">
              My Profile
            </Nav.Link>
          ) : null}
          {token ? (
            <Nav.Link
              href="/"
              className="nav-item"
              onClick={AuthService.logout}
            >
              Logout
            </Nav.Link>
          ) : (
            <Nav.Link href="/" className="nav-item">
              Login / Sign Up
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
