import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { MovieSearch, IMovie } from "../models/Movie";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../styles/discover.css";
import { QUERY_TOP_MOVIES } from "../utils/queries/movieQueries";

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movies = location.state?.movies || [];

  const { data: topMoviesData } = useQuery<{ topMovies: IMovie[] }>(QUERY_TOP_MOVIES);
  console.log("topMoviesData", topMoviesData);

  return (
    <Container className="discover">
      {movies.map((movies: MovieSearch) => (
        <Card key={movies.imdbID}>
          <Card.Img src={movies.Poster} alt={movies.Title} />
          <Card.Title>{movies.Title}</Card.Title>
          <Card.Text>{movies.Year}</Card.Text>
          <Button
            onClick={() => {
              navigate(`/movies/${movies.imdbID}`);
            }}
          >
            View Details
          </Button>
        </Card>
      ))}
    </Container>
  );
};

export default Discover;
