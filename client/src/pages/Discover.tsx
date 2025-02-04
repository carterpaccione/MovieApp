import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { MovieSearch, IMovie } from "../models/Movie";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../styles/discover.css";
import { QUERY_TOP_MOVIES } from "../utils/queries/movieQueries";
import { QUERY_USER_LIST_DATA } from "../utils/queries/userQueries";
import { set } from "date-fns";

interface SeenMovie {
  movie: {
    imdbID: string;
    title: string;
  };
  rating: {
    score: number;
  };
  status: string;
}

interface Recommendation {
  title: string;
  year: string;
  imdbID: string;
}

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

  const { data: userListData } = useQuery<{ userListData: { movies: SeenMovie[] } }>(QUERY_USER_LIST_DATA);
  console.log("User List Data: ", userListData?.userListData);

  const [recommendations, setRecommendations] = useState<Recommendation[]>(JSON.parse(localRecs || '[]'));
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
    }))

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
      localStorage.setItem("recommendations", JSON.stringify(data.parsedResponse.recommendations));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setRecommendations(JSON.parse(localStorage.getItem("recommendations") || '[]'));
  };

  return (
    <Container className="discover">
      <Button
        onClick={() => getRecommendations(userListData?.userListData.movies || [])}
      >
        Get Recommendations
      </Button>
      {recommendations.length > 0 && recommendations.map((movie: Recommendation) => (
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
      <Container>
        <h4>Top</h4>
        {topMoviesData?.topMovies.map((movie) => {
          return (
            <Card key={movie.imdbID}>
              <Card.Img src={movie.poster} alt={movie.title} />
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
      </Container>
    </Container>
  );
};

export default Discover;
