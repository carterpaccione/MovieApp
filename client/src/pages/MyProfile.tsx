import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../styles/myProfile.css";

import { Recommendation } from "../models/Movie.js";

import MovieTable from "../components/movieTable.js";

import { QUERY_ME } from "../utils/queries/userQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const localRecs = localStorage.getItem("recommendations");
  if (!localRecs) {
    localStorage.setItem("recommendations", JSON.stringify([]));
  }

  const [recommendations] = useState<Recommendation[]>(
    JSON.parse(localRecs || "[]")
  );

  const navigate = useNavigate();

  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
  };

  const handleMovieNavigate = (imdbID: string) => {
    navigate(`/movies/${imdbID}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  console.log("Data:", data);

  return (
    <Container>
      <Row>
          <h3>{data.me.username}'s Profile</h3>
      </Row>
      <Row>
        <Col id="recommended-container">
          <h4>Recommended For You</h4>
          {recommendations.length > 0 ? (
            recommendations.map((movie: Recommendation, index: number) => (
              <Card style={{ width: "18rem" }} key={index}>
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Button onClick={() => handleMovieNavigate(movie.imdbID)}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </Col>
        <Col>
          <MovieTable movies={data.me.movies} />
        </Col>
        <Col id="friends-container">
          <h3>FriendsList</h3>
          {data.me.friends.length > 0 ? (
            data.me.friends.map((friend: any, index: number) => (
              <Card style={{ width: "18rem" }} key={index}>
                <Card.Body>
                  <Card.Title onClick={() => handleUserNavigate(friend._id)}>
                    {friend.username}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No Friends Yet</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
