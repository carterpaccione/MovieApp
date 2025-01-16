import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";

import AuthService from "../utils/auth";
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
    <header>
      <div className="container">
        <h1>Movie App</h1>
        <nav>
          <ul>
            <li>
              <a href="/discover">Discover</a>
            </li>
              {token ? <li><a href="/me">My Profile</a></li> : null}
              {token ? <li><a href="/" onClick={AuthService.logout}>Logout</a></li> : <li><a href="/">Login / Sign Up</a></li>}
          </ul>
        </nav>
      </div>
      <div className='search-container'>
        <Form.Control className="search-bar"
          size="lg"
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <button
        className="search-button"
        onClick={() => handleSearch(query)}>Search</button>
      </div>
    </header>
  );
};

export default Header;
