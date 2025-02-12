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
      fetchMovieByID(idParams.id)
      .then((data) => setPageMovie(data));
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
            <Button className="button" onClick={() => handleSeenButton()}>
              Mark Seen
            </Button>
            <Button className="button" onClick={() => handleWatchListButton()}>
              Add to WatchList
            </Button>
          </Col>
        );
        return;
      }

      if (userMovieData.userMovieData.status === "SEEN") {
        setButtonState(
          <Col className="buttonContainer">
            <Button className="button" onClick={() => handleRemoveButton()}>
              Mark Unseen
            </Button>
          </Col>
        );
        return;
      } else if (userMovieData.userMovieData.status === "WATCH_LIST") {
        setButtonState(
          <Col className="buttonContainer">
            <Button className="button" onClick={() => handleSeenButton()}>
              Mark Seen
            </Button>
            <Button className="button" onClick={() => handleRemoveButton()}>
              Remove From WatchList
            </Button>
          </Col>
        );
        return;
      } else {
        setButtonState(
          <Col className="buttonContainer">
            <Button className="button" onClick={() => handleSeenButton()}>
              Mark Seen
            </Button>
            <Button className="button" onClick={() => handleWatchListButton()}>
              Add to WatchList
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
                <Card key={rating._id} style={{ width: "18rem" }} className="ratingCard">
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
