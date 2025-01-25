import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { IUserMovie } from "../models/Movie.js";
import { QUERY_ME } from "../utils/queries/userQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const navigate = useNavigate();

  const handleMovieNavigate = (imdbID: string) => {
    navigate(`/movies/${imdbID}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  console.log("Data:", data);

  return (
    <Container>
      <Row>
        <Col>
          <h3>{data.me.username}'s Profile</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          {data.me.movies.map((userMovie: IUserMovie, index: number) => (
            <Card style={{ width: "18rem" }} key={index}>
              <Card.Img variant="top" src={userMovie.movie.poster}></Card.Img>
              <Card.Body>
                <Card.Title
                  onClick={() => handleMovieNavigate(userMovie.movie.imdbID)}
                >
                  {userMovie.movie.title}
                </Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Status: {userMovie.status}</ListGroup.Item>
                  <ListGroup.Item>
                    Rating:
                    {userMovie.rating.score
                      ? userMovie.rating.score
                      : "Not Yet Rated"}
                  </ListGroup.Item>
                </ListGroup>
                {userMovie.rating.review ? (
                  <Card.Text>Review: {userMovie.rating.review}</Card.Text>
                ) : null}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
