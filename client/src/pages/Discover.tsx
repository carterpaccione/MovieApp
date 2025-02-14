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
import Button from "react-bootstrap/Button";

import "../styles/discover.css";
import { QUERY_TOP_MOVIES } from "../utils/queries/movieQueries";
import {
  QUERY_USER_LIST_DATA,
  QUERY_USER_RECOMMENDATIONS,
} from "../utils/queries/userQueries";
import { SET_RECOMMENDATIONS } from "../utils/mutations/userMutations";
import { fetchMovieByID } from "../utils/helper";
import { ImportMeta } from "../components/header.js";

import MovieCard from "../components/movieCard";

const Discover = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const apiURL = (import.meta as unknown as ImportMeta).env.VITE_API_BASE_URL;
  const movies = location.state?.movies || [];

  const { data: topMoviesData } = useQuery<{ topMovies: IMovie[] }>(
    QUERY_TOP_MOVIES
  );

  const { data: userListData } = useQuery<{
    userListData: { movies: SeenMovie[] };
  }>(QUERY_USER_LIST_DATA);

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
      const response = await fetch(`${apiURL}/api/recommend`, {
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
        console.error("No recommendations found");
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
      <MovieCard
        movie={movie}
        key={`rec-${movie.imdbID}`}
        onClick={() => {
          navigate(`/movies/${movie.imdbID}`);
        }}
      />
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
          <MovieCard
            movie={movie}
            key={`search-${movie.imdbID}`}
            onClick={() => {
              navigate(`/movies/${movie.imdbID}`);
            }}
          />
        ))}
      </Row>
      <Row className="movies-container">
        <h4>Top 5</h4>
        {topMoviesData?.topMovies.map((movie) => {
          return (
            <MovieCard
              movie={{
                Title: movie.title,
                Poster: movie.poster,
                imdbID: movie.imdbID,
                averageRating: movie.averageRating,
              }}
              key={`top-${movie.imdbID}`}
              onClick={() => {
                navigate(`/movies/${movie.imdbID}`);
              }}
            />
          );
        })}
      </Row>
      <Row className="movies-container">
        <Row className="movies-container">
          <h4>Recommended For You</h4>
          {userListData?.userListData.movies.length === 0 ? null : (
            <Button
              className="button"
              id="get-recommendations-button"
              onClick={() =>
                getRecommendations(userListData?.userListData.movies || [])
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M400-480ZM160-160q-33 0-56.5-23.5T80-240v-240h80v240h480v-480H400v-80h240q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm40-160h400L465-500 360-360l-65-87-95 127Zm-40-240v-80H80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
              </svg>
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
