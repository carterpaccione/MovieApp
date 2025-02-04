import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  MovieSearch,
  IMovie,
  SeenMovie,
  Recommendation,
} from "../models/Movie";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../styles/discover.css";
import { QUERY_TOP_MOVIES } from "../utils/queries/movieQueries";
import { QUERY_USER_LIST_DATA } from "../utils/queries/userQueries";

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movies = location.state?.movies || [];

  const localRecs = localStorage.getItem("recommendations");
  if (!localRecs) {
    localStorage.setItem("recommendations", JSON.stringify([]));
  }

  const { data: topMoviesData } = useQuery<{ topMovies: IMovie[] }>(
    QUERY_TOP_MOVIES
  );
  console.log("Top Movies Data: ", topMoviesData);

  const { data: userListData } = useQuery<{
    userListData: { movies: SeenMovie[] };
  }>(QUERY_USER_LIST_DATA);
  console.log("User List Data: ", userListData?.userListData);

  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    JSON.parse(localRecs || "[]")
  );
  console.log("Recommendations: ", recommendations);

  const getRecommendations = async (userMovies: SeenMovie[]) => {
    if (userMovies.length === 0) {
      return;
    }
    console.log("User Movies: ", userMovies);
    const cleanedMovies = userMovies.map((movie: SeenMovie) => ({
      movie: {
        title: movie.movie.title,
        imdbID: movie.movie.imdbID,
      },
      status: movie.status,
      rating: {
        score: movie.rating?.score || null,
      },
    }));

    try {
      const response = await fetch("http://localhost:3001/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movies: cleanedMovies }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      console.log("Data: ", data);
      localStorage.setItem(
        "recommendations",
        JSON.stringify(data.parsedResponse.recommendations)
      );
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setRecommendations(
      JSON.parse(localStorage.getItem("recommendations") || "[]")
    );
  };

  return (
    <Container>
      <Row>
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
      </Row>
      <Row>
        <h4>Top 5</h4>
        {topMoviesData?.topMovies.map((movie) => {
          return (
            <Card key={movie.imdbID}>
              <Card.Img id="card-image" src={movie.poster} alt={movie.title} />
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>{movie.averageRating}</Card.Text>
              <Button
                onClick={() => {
                  navigate(`/movies/${movie.imdbID}`);
                }}
              >
                View Details
              </Button>
            </Card>
          );
        })}
      </Row>
      <Row>
        <Col sm={2}>
          <h4>Recommended For You</h4>
          {userListData?.userListData.movies.length === 0 ? null : (
            <Button
              onClick={() =>
                getRecommendations(userListData?.userListData.movies || [])
              }
            >
              Get Recs
            </Button>
          )}
        </Col>
        <Col sm={10}>
          <Row>
            {recommendations.length > 0 &&
              recommendations.map((movie: Recommendation) => (
                <Card key={movie.imdbID}>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>{movie.year}</Card.Text>
                  <Button
                    onClick={() => {
                      navigate(`/movies/${movie.imdbID}`);
                    }}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Discover;
