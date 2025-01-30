import { useEffect, useState } from "react";
import { IUserMovie } from "../models/Movie.js";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

interface MovieTableProps {
  movies: IUserMovie[];
}

const MovieTable = (props: MovieTableProps) => {
  const [watchList, setWatchList] = useState<IUserMovie[]>([]);
  const [seenList, setSeenList] = useState<IUserMovie[]>([]);
  const [reviewList, setReviewList] = useState<IUserMovie[]>([]);

  const navigate = useNavigate();

  const handleMovieNavigate = (imdbID: string) => {
    navigate(`/movies/${imdbID}`);
  };

  const sortedMovies = (data: MovieTableProps) => {
    let WATCH_LIST: IUserMovie[] = [];
    let SEEN: IUserMovie[] = [];
    let REVIEWS: IUserMovie[] = [];

    data.movies.forEach((movie: IUserMovie) => {
      if (movie.status === "WATCH_LIST") {
        WATCH_LIST.push(movie);
        if (movie.rating !== null && movie.rating.review !== "") {
          REVIEWS.push(movie);
        }
      } else if (movie.status === "SEEN") {
        SEEN.push(movie);
        if (movie.rating.review !== "") {
          REVIEWS.push(movie);
        }
      }
      console.log("WATCH LIST:", WATCH_LIST);
      console.log("SEEN:", SEEN);
      console.log("REVIEWS:", REVIEWS);
    });
    setWatchList(WATCH_LIST);
    setSeenList(SEEN);
    setReviewList(REVIEWS);
  };

  const renderWatchList = (watchList: IUserMovie[]) => {
    console.log("RENDERWATCHLIST:", watchList);
    if (watchList.length === 0) {
      return <tr>No movies in watch list</tr>;
    }
    return watchList.map((userMovie: IUserMovie, index: number) => {
      return (
        <tr key={index}>
          <td><img src={userMovie.movie.poster}></img></td>
          <td>{userMovie.movie.title}</td>
          <td>{userMovie.movie.averageRating}</td>
          <td>
            <Button onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}>View</Button>
          </td>
        </tr>
      );
    });
  };

  const renderSeenList = (seenList: IUserMovie[]) => {
    console.log("RENDERSEENLIST:", seenList);
    if (seenList.length === 0) {
      return <tr>No movies in seen list</tr>;
    }
    return seenList.map((userMovie: IUserMovie, index: number) => {
      return (
        <tr key={index}>
          <td><img src={userMovie.movie.poster}></img></td>
          <td>{userMovie.movie.title}</td>
          <td>{userMovie.rating.score}</td>
          <td>{userMovie.rating.score}</td>
          <td>
            <Button onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}>View</Button>
          </td>
        </tr>
      );
    });
  };

  const renderReviews = (reviews: IUserMovie[]) => {
    if (reviews.length === 0) {
      return <tr>No reviews</tr>;
    }
    return reviews.map((userMovie: IUserMovie, index: number) => {
      console.log("RENDERREVIEWS:", reviews);
      return (
        <tr key={index}>
          <td><img src={userMovie.movie.poster}></img></td>
          <td>{userMovie.movie.title}</td>
          <td>{userMovie.rating.score}</td>
          <td>{userMovie.rating.review}</td>
          <td>
            <Button onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}>View</Button>
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    sortedMovies(props);
    renderWatchList(watchList);
    renderSeenList(seenList);
    renderReviews(reviewList);
  }, [props.movies]);

  console.log("MOVIE TABLE PROPS:", props);

  return (
    <Container>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Watch List</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Average Rating</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>{renderWatchList(watchList)}</tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Seen List</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Score</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>{renderSeenList(seenList)}</tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Reviews</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Page</th>
                </tr>
              </thead>
              <tbody>{renderReviews(reviewList)}</tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default MovieTable;
