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
  let { data: userMovieData, refetch: userMovieDataRefetch } = useQuery<{
    userMovieData: IUserMovie;
  }>(QUERY_USER_MOVIE_DATA, {
    variables: { movieID: dbMovie?.movie._id },
  });

  const [buttonState, setButtonState] = useState<JSX.Element | null>(null);
  const [buttonError, setButtonError] = useState(null);

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
          setPageMovie(null);
        }
      }
    };

    const updateReviewFormProps = () => {
      if (userMovieData?.userMovieData) {
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

    const updateButtonState = () => {
      if (!userMovieData || !userMovieData.userMovieData) {
        setButtonState(
          <Col className="buttonContainer">
            <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
            <Button onClick={() => handleWatchListButton()}>
              Add to Watchlist
            </Button>
          </Col>
        );
        return;
      }

      if (userMovieData.userMovieData.status === "SEEN") {
        setButtonState(
          <Col className="buttonContainer">
            <Button onClick={() => handleRemoveButton()}>Mark Unseen</Button>
            <Button onClick={() => handleWatchListButton()}>
              Add to Watchlist
            </Button>
          </Col>
        );
        return;
      } else if (userMovieData.userMovieData.status === "WATCH_LIST") {
        setButtonState(
          <Col className="buttonContainer">
            <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
            <Button onClick={() => handleRemoveButton()}>
              Remove From WatchList
            </Button>
          </Col>
        );
        return;
      } else {
        setButtonState(
          <Col className="buttonContainer">
            <Button onClick={() => handleSeenButton()}>Mark Seen</Button>
            <Button onClick={() => handleWatchListButton()}>
              Add to Watchlist
            </Button>
          </Col>
        );
        return;
      }
    }

    if (idParams.id) fetchPageMovieData();
    updateButtonState();
    // if (userMovieData) updateReviewFormProps();
    
  }, [idParams.id, pageMovie, dbMovie, userMovieDataRefetch]);

  const saveMovie = async () => {
    console.log("Saving movie to database...");
    console.log("Page movie:", pageMovie);
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
      await addToSeen({
        variables: { movieID: movieData?.data.saveMovieToDB._id },
      });
      userMovieDataRefetch();
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
    } catch (error: any) {
      console.error("Error saving movie:", error);
      setButtonError(error.message);
    }
  };

  const handleRemoveButton = async () => {
    try {
      await removeFromUser({ variables: { movieID: dbMovie?.movie._id } });
    } catch (error: any) {
      console.error("Error removing movie:", error);
      await userMovieDataRefetch();
    }
  };

  return (
    <Container fluid="md">
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
          {dbMovie?.movie.ratings && dbMovie.movie.ratings.map((rating: IRating) =>
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
