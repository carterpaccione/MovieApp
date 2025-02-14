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
import { DELETE_RATING } from "../utils/mutations/ratingMutations.js";
import { fetchMovieByID } from "../utils/helper";

const Movie = () => {
  const idParams = useParams<{ id: string }>();
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
  const [pageMovie, setPageMovie] = useState<Movie | null>(null);

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

  const [saveMovieToDB] = useMutation(SAVE_MOVIE_TO_DB);
  const [addToSeen] = useMutation(ADD_TO_SEEN);
  const [addToWatchList] = useMutation(ADD_TO_WATCHLIST);
  const [removeFromUser] = useMutation(REMOVE_FROM_USER);
  const [deleteRating] = useMutation(DELETE_RATING);

  const navigate = useNavigate();
  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
  };

  const [buttonState, setButtonState] = useState<JSX.Element | null>(null);
  const [buttonError, setButtonError] = useState(null);

  const [reviewFormProps, setReviewFormProps] = useState<ReviewFormProps>({
    movieID: "",
    handleUserMovieRefetch: () => {},
    handleDBMovieRefetch: () => {},
  });

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
      setButtonError(error.message);
    }
  };

  const handleSeenButton = async () => {
    try {
      const movieData = await saveMovie();
      if (!movieData?.data.saveMovieToDB._id) {
        throw new Error("Movie could not save to DB.");
      }
      await addToSeen({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      userMovieDataRefetch();
      await dbMovieRefetch();
    } catch (error: any) {
      console.error("Error saving movie:", error);
      setButtonError(error.message);
    }
  };

  const handleWatchListButton = async () => {
    try {
      const movieData = await saveMovie();
      await addToWatchList({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      userMovieDataRefetch();
      await dbMovieRefetch();
    } catch (error: any) {
      console.error("Error saving movie:", error);
      setButtonError(error.message);
    }
  };

  const handleRemoveButton = async () => {
    try {
      await removeFromUser({ variables: { movieID: dbMovie?.movie._id } });
      await userMovieDataRefetch();
    } catch (error: any) {
      console.error("Error removing movie:", error);
    }
  };

  const handleDeleteRating = async (ratingID: string) => {
    try {
      await deleteRating({
        variables: { ratingID: ratingID },
      });
      await userMovieDataRefetch();
      await dbMovieRefetch();
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  useEffect(() => {
    if (idParams.id) {
      fetchMovieByID(idParams.id).then((data) => setPageMovie(data));
    }
  }, [idParams.id]);

  useEffect(() => {
    const updateButtonState = () => {
      if (
        !userMovieData ||
        !userMovieData.userMovieData ||
        userMovieData.userMovieData.status === "NONE"
      ) {
        setButtonState(
          <Col className="buttonContainer">
            <Button
              className="button"
              id="mark-seen-button"
              onClick={() => handleSeenButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </Button>
            <Button
              className="button"
              id="mark-watchlist-button"
              onClick={() => handleWatchListButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M120-320v-80h280v80H120Zm0-160v-80h440v80H120Zm0-160v-80h440v80H120Zm520 480v-160H480v-80h160v-160h80v160h160v80H720v160h-80Z" />
              </svg>
            </Button>
          </Col>
        );
        return;
      }

      if (userMovieData.userMovieData.status === "SEEN") {
        setButtonState(
          <Col className="buttonContainer">
            <Button
              className="button"
              id="remove-seen-button"
              onClick={() => handleRemoveButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
              </svg>
            </Button>
          </Col>
        );
        return;
      } else if (userMovieData.userMovieData.status === "WATCH_LIST") {
        setButtonState(
          <Col className="buttonContainer">
            <Button
              className="button"
              id="mark-seen-button"
              onClick={() => handleSeenButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </Button>
            <Button
              className="button"
              id="remove-watchlist-button"
              onClick={() => handleRemoveButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m576-80-56-56 104-104-104-104 56-56 104 104 104-104 56 56-104 104 104 104-56 56-104-104L576-80ZM120-320v-80h280v80H120Zm0-160v-80h440v80H120Zm0-160v-80h440v80H120Z" />
              </svg>
            </Button>
          </Col>
        );
        return;
      } else {
        setButtonState(
          <Col className="buttonContainer">
            <Button
              className="button"
              id="mark-seen-button"
              onClick={() => handleSeenButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            </Button>
            <Button
              className="button"
              id="mark-watchlist-button"
              onClick={() => handleWatchListButton()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M120-320v-80h280v80H120Zm0-160v-80h440v80H120Zm0-160v-80h440v80H120Zm520 480v-160H480v-80h160v-160h80v160h160v80H720v160h-80Z" />
              </svg>
            </Button>
          </Col>
        );
        return;
      }
    };
    updateButtonState();
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
        handleUserMovieRefetch: userMovieDataRefetch,
        handleDBMovieRefetch: dbMovieRefetch,
      });
    }
  }, [userMovieData, pageMovie, dbMovie]);
  
  return (
    <Container className="page-container">
      <Container>
        <Row className="movieContainer">
          <h2 className="movieTitle">{pageMovie?.Title}</h2>
          <Row>
            {buttonState}
            {buttonError && <p className="text-danger">{buttonError}</p>}
          </Row>
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
            <p>Our Average Rating: {dbMovie?.movie.averageRating}</p>
            <p>IMDB Rating: {pageMovie?.imdbRating}</p>
            <Row>
              <ReviewForm
                movieID={reviewFormProps.movieID}
                rating={reviewFormProps?.rating}
                handleUserMovieRefetch={userMovieDataRefetch}
                handleDBMovieRefetch={dbMovieRefetch}
              />
            </Row>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          {dbMovie?.movie.ratings &&
            dbMovie.movie.ratings.map((rating: IRating) =>
              rating.review && rating.review.length > 0 ? (
                <Card
                  key={rating._id}
                  style={{ width: "18rem" }}
                  className="ratingCard"
                >
                  <Card.Body>
                    <Card.Title>
                      <Card.Link
                        onClick={() => handleUserNavigate(rating.user._id)}
                      >
                        {rating.user.username}
                      </Card.Link>
                    </Card.Title>
                    <Card.Title>Score: {rating.score}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>{rating.review}</Card.Text>
                    {rating.user._id === userInfo._id ? (
                      <Button
                        className="button"
                        onClick={() => handleDeleteRating(rating._id)}
                      >
                        Delete
                      </Button>
                    ) : null}
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
