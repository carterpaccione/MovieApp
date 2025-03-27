import { useEffect, useState } from "react";
import { IUserMovie } from "../models/Movie.js";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";

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
        if (movie.rating !== null && movie.rating.review !== "") {
          REVIEWS.push(movie);
        }
      }
    });
    setWatchList(WATCH_LIST);
    setSeenList(SEEN);
    setReviewList(REVIEWS);
  };

  const renderWatchList = (watchList: IUserMovie[]) => {
    if (watchList.length === 0) {
      return (
        <tr>
          <td>No movies in watch list</td>
        </tr>
      );
    }
    return watchList.map((userMovie: IUserMovie, index: number) => {
      return (
        <tr key={index}>
          <td>
            <img
              src={userMovie.movie.poster}
              className="table-image"
              onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}
            ></img>
          </td>
          <td>{userMovie.movie.title}</td>
          <td>{userMovie.movie.averageRating}</td>
        </tr>
      );
    });
  };

  const renderSeenList = (seenList: IUserMovie[]) => {
    if (seenList.length === 0) {
      return (
        <tr>
          <td>No movies in seen list</td>
        </tr>
      );
    }
    return seenList.map((userMovie: IUserMovie, index: number) => {
      return (
        <tr key={index}>
          <td>
            <img
              src={userMovie.movie.poster}
              className="table-image"
              onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}
            ></img>
          </td>
          <td>{userMovie.movie.title}</td>
          <td>{userMovie.rating ? userMovie.rating.score : null}</td>
          <td>{userMovie.movie.averageRating}</td>
        </tr>
      );
    });
  };

  const renderReviews = (reviews: IUserMovie[]) => {
    if (reviews.length === 0) {
      return <Row>No reviews</Row>;
    }
    return reviews.map((userMovie: IUserMovie, index: number) => {
      return (
        <Row key={index} className="reviewContainer">
          <Col>
            <h5>{userMovie.movie.title}</h5>
            <img
              src={userMovie.movie.poster}
              onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}
            ></img>
          </Col>
          <Col>
            <Row>
              <h5>Score: {userMovie.rating.score}</h5>
            </Row>
            <Row>{userMovie.rating.review}</Row>
          </Col>
        </Row>
      );
    });
  };

  useEffect(() => {
    sortedMovies(props);
    renderWatchList(watchList);
    renderSeenList(seenList);
    renderReviews(reviewList);
  }, [props.movies]);

  return (
    <Container>
      <Accordion className="accordion" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="accordion-header">Watch List</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Average Score</th>
                </tr>
              </thead>
              <tbody>{renderWatchList(watchList)}</tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header className="accordion-header">Seen List</Accordion.Header>
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
          <Accordion.Header className="accordion-header">Reviews</Accordion.Header>
          <Accordion.Body>
            <Container>{renderReviews(reviewList)}</Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default MovieTable;
