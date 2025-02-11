import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
import {
  QUERY_USER_LIST_DATA,
  QUERY_USER_RECOMMENDATIONS,
} from "../utils/queries/userQueries";
import { SET_RECOMMENDATIONS } from "../utils/mutations/userMutations";
import { fetchMovieByID } from "../utils/helper";

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movies = location.state?.movies || [];

  const { data: topMoviesData } = useQuery<{ topMovies: IMovie[] }>(
    QUERY_TOP_MOVIES
  );

  const { data: userListData } = useQuery<{
    userListData: { movies: SeenMovie[] };
  }>(QUERY_USER_LIST_DATA);
  console.log("User List Data: ", userListData);

  const [saveRecommendations] = useMutation(SET_RECOMMENDATIONS);
  const { data: recommendationData, refetch: refetchRecommendations } =
    useQuery<{
      userRecommendations: { recommendedMovies: MovieSearch[] };
    }>(QUERY_USER_RECOMMENDATIONS);

  const [recommendations, setRecommendations] = useState<MovieSearch[]>([]);

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
      const recs = Array.isArray(data.parsedResponse?.recommendations)
        ? data.parsedResponse?.recommendations
        : [];

      if (recs.length === 0) {
        console.log("No recommendations found");
        return;
      }
      const recArray: MovieSearch[] = await Promise.all(
        recs.map(async (rec: Recommendation) => {
          const movie = await fetchMovieByID(rec.imdbID);
          return {
            Title: movie.Title,
            Year: movie.Year,
            imdbID: movie.imdbID,
            Type: movie.Type,
            Poster: movie.Poster,
          };
        })
      );
      console.log("Rec Array: ", recArray);
      await saveRecommendations({ variables: { input: { movies: recArray } } });
      await refetchRecommendations();
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const renderRecommendations = (data: MovieSearch[]) => {
    if (data.length === 0) {
      return <div>No recommendations found</div>;
    }
    return data.map((movie: MovieSearch) => (
      <Card className="movie-card" key={`rec-${movie.imdbID}`}>
        <Card.Img src={movie.Poster} alt={movie.Title} />
        <Card.Title className="movie-card-text">{movie.Title}</Card.Title>
        <Card.Text className="movie-card-text">{movie.Year}</Card.Text>
        <Button
          className="button"
          onClick={() => {
            navigate(`/movies/${movie.imdbID}`);
          }}
        >
          View Details
        </Button>
      </Card>
    ));
  };

  useEffect(() => {
    if (recommendationData) {
      setRecommendations(
        recommendationData.userRecommendations.recommendedMovies
      );
      renderRecommendations(recommendations);
    }
  }, [recommendationData]);

  return (
    <Container className="page-container">
      <Row className="movies-container">
        {movies.map((movie: MovieSearch) => (
          <Card className="movie-card" key={`search-${movie.imdbID}`}>
            <Card.Img src={movie.Poster} alt={movie.Title} />
            <Card.Title className="movie-card-text">{movie.Title}</Card.Title>
            <Card.Text className="movie-card-text">{movie.Year}</Card.Text>
            <Button
              className="button movie-card-button"
              onClick={() => {
                navigate(`/movies/${movie.imdbID}`);
              }}
            >
              View Details
            </Button>
          </Card>
        ))}
      </Row>
      <Row className="movies-container">
        <h4>Top 5</h4>
        {topMoviesData?.topMovies.map((movie) => {
          return (
            <Card className="movie-card" key={`top-${movie.imdbID}`}>
              <Card.Img id="card-image" src={movie.poster} alt={movie.title} />
              <Card.Title className="movie-card-text">{movie.title}</Card.Title>
              <Card.Text className="movie-card-text">
                {movie.averageRating}
              </Card.Text>
              <Button
                className="button"
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
      <Row className="movies-container">
        <Row className="movies-container">
          <h4>Recommended For You</h4>
          {userListData?.userListData.movies.length === 0 ? null : (
            <Button
              className="button"
              onClick={() =>
                getRecommendations(userListData?.userListData.movies || [])
              }
            >
              Generate
            </Button>
          )}
        </Row>
        <Col sm={10}>
          <Row className="movies-container">
            {renderRecommendations(recommendations)}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Discover;
