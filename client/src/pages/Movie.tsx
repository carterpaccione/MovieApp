import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../styles/movie.css";

import ReviewForm, { ReviewFormProps } from "../components/reviewForm.js";
import type { Movie, IMovie } from "../models/Movie.js";
import type { IRating } from "../models/Rating.js";
import type { IUserMovie } from "../models/UserMovie.js";
import { QUERY_MOVIE } from "../utils/queries/movieQueries.js";
import { QUERY_USER_MOVIE_DATA } from "../utils/queries/userQueries.js";
import { SAVE_MOVIE_TO_DB } from "../utils/mutations/movieMutations";
import {
  ADD_TO_SEEN,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_USER,
} from "../utils/mutations/userMutations";

const Movie = () => {
  const idParams = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
  };
  const [saveMovieToDB] = useMutation(SAVE_MOVIE_TO_DB);
  const [addToSeen] = useMutation(ADD_TO_SEEN);
  const [addToWatchList] = useMutation(ADD_TO_WATCHLIST);
  const [removeFromUser] = useMutation(REMOVE_FROM_USER);
  const [pageMovie, setPageMovie] = useState<Movie | null>(null);
  const [reviewFormProps, setReviewFormProps] = useState<ReviewFormProps>({
    movieID: "",
    rating: { score: 1, review: "" },
    handleUserMovieRefetch: () => {},
    handleDBMovieRefetch: () => {},
  });
  const { data: dbMovie, refetch: dbMovieRefetch } = useQuery<{
    movie: IMovie;
  }>(QUERY_MOVIE, {
    variables: { imdbID: idParams.id },
  });
  const { data: userMovieData, refetch: userMovieDataRefetch } = useQuery<{
    userMovieData: IUserMovie;
  }>(QUERY_USER_MOVIE_DATA, {
    variables: { movieID: dbMovie?.movie._id },
  });

  useEffect(() => {
    const fetchPageMovieData = async () => {
      if (idParams.id) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/movies/${idParams.id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setPageMovie(data);
        } catch (error: any) {
          console.error("Error fetching data:", error);
        }
      }
    };

    const updateReviewFormProps = () => {
      if (userMovieData) {
        setReviewFormProps({
          movieID: dbMovie?.movie._id || "",
          rating: {
            score: userMovieData.userMovieData.rating?.score || 1,
            review: userMovieData.userMovieData.rating?.review || "",
          },
          handleUserMovieRefetch: userMovieDataRefetch,
          handleDBMovieRefetch: dbMovieRefetch,
        });
      } else {
        setReviewFormProps({
          movieID: dbMovie?.movie._id || "",
          rating: { score: 1, review: "" },
          handleUserMovieRefetch: userMovieDataRefetch,
          handleDBMovieRefetch: dbMovieRefetch,
        });
      }
    };

    fetchPageMovieData();
    updateReviewFormProps();
  }, [idParams.id, dbMovie, userMovieData, userMovieDataRefetch]);

  const saveMovie = async () => {
    try {
      const movieData = await saveMovieToDB({
        variables: {
          input: {
            title: pageMovie?.Title,
            imdbID: pageMovie?.imdbID,
            poster: pageMovie?.Poster,
          },
        },
      });
      return movieData;
    } catch (error: any) {
      console.error("Error saving movie:", error);
    }
  };

  const handleSeenButton = async () => {
    try {
      const movieData = await saveMovie();
      await addToSeen({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      userMovieDataRefetch();
    } catch (error: any) {
      console.error("Error saving movie:", error);
    }
  };

  const handleWatchListButton = async () => {
    try {
      const movieData = await saveMovie();
      await addToWatchList({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      userMovieDataRefetch();
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleRemoveButton = async () => {
    try {
      await removeFromUser({ variables: { movieID: dbMovie?.movie._id } });
      dbMovieRefetch();
      userMovieDataRefetch();
    } catch (error: any) {
      console.error("Error removing movie:", error);
    }
  };

  const checkUserMovieStatus = (data: IUserMovie | undefined) => {
    if (data === null || data === undefined || !data) {
      return (
        <Col className="buttonContainer">
          <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
          <Button onClick={() => handleWatchListButton()}>
            Add to Watchlist
          </Button>
        </Col>
      );
    }
    if (data.status === "SEEN") {
      return (
        <Col className="buttonContainer">
          <Button onClick={() => handleRemoveButton()}>Mark Unseen</Button>
          <Button onClick={() => handleWatchListButton()}>
            Add to Watchlist
          </Button>
        </Col>
      );
    } else if (data.status === "WATCH_LIST") {
      return (
        <Col className="buttonContainer">
          <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
          <Button onClick={() => handleRemoveButton()}>
            Remove From WatchList
          </Button>
        </Col>
      );
    } else {
      return (
        <Col className="buttonContainer">
          <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
          <Button onClick={() => handleWatchListButton()}>
            Add to Watchlist
          </Button>
        </Col>
      );
    }
  };

  return (
    <Container fluid="md">
      <Container>
        <Row className="movieContainer">
          <h2 className="movieTitle">{pageMovie?.Title}</h2>
          <Row>{checkUserMovieStatus(userMovieData?.userMovieData)}</Row>
          <Col>
            <img
              id="moviePoster"
              src={pageMovie?.Poster}
              alt={pageMovie?.Title}
            />
          </Col>
          <Col>
            <h4>Plot:</h4>
            <p>{pageMovie?.Plot}</p>
            <p>Average Rating: {dbMovie?.movie.averageRating}</p>
            <Row>
              {dbMovie?.movie._id && (
                <ReviewForm
                  movieID={dbMovie.movie._id}
                  rating={reviewFormProps?.rating}
                  handleUserMovieRefetch={userMovieDataRefetch}
                  handleDBMovieRefetch={dbMovieRefetch}
                />
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          {dbMovie?.movie.ratings.map((rating: IRating) =>
            rating.review && rating.review.length > 0 ? (
              <Card key={rating._id} style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>{rating.score}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(rating.createdAt).toLocaleString()}
                  </Card.Subtitle>
                  <Card.Text>{rating.review}</Card.Text>
                  <Card.Link
                    onClick={() => handleUserNavigate(rating.user._id)}
                  >
                    {rating.user.username}
                  </Card.Link>
                </Card.Body>
              </Card>
            ) : null
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Movie;
