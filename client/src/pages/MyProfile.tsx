import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../styles/myProfile.css";

import { MovieSearch } from "../models/Movie.js";
import { IFriendship } from "../models/Friendship.js";

import MovieTable from "../components/movieTable.js";

import { QUERY_ME } from "../utils/queries/userQueries.js";
import { QUERY_INCOMING_REQUESTS } from "../utils/queries/friendshipQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const { data: requestsData, loading: requestsLoading, error: requestsError } = useQuery(QUERY_INCOMING_REQUESTS);

  const [incomingRequests, setIncomingRequests] = useState<IFriendship[]>([]);

  useEffect(() => {
    if (requestsData) {
      setIncomingRequests(requestsData.incomingRequests);
    }
  }, [requestsData])

  const navigate = useNavigate();

  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
  };

  const handleMovieNavigate = (imdbID: string) => {
    navigate(`/movies/${imdbID}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  
  return (
    <Container className="page-container">
      <Row>
          <h3>{data.me.username}'s Profile</h3>
      </Row>
      <Row>
        <Col id="recommended-container">
          <h4>For You</h4>
          {data.me.recommendedMovies.length > 0 ? (
            data.me.recommendedMovies.map((movie: MovieSearch) => (
              <Card className="recommended-card" key={`rec-${movie.imdbID}`}>
                <Card.Body>
                  <Card.Img src={movie.Poster} alt={movie.Title} />
                  <Card.Title>{movie.Title}</Card.Title>
                  <Button className="button" onClick={() => handleMovieNavigate(movie.imdbID)}>
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
              <Card className="friend-card" key={index}>
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
          <h3>Requests</h3>
          {requestsLoading && <p>Loading...</p>}
          {requestsError && <p>Error!</p>}
          {incomingRequests && incomingRequests.length > 0 ? (
            incomingRequests.map((request: IFriendship, index: number) => (
              <Card style={{ width: "max-content" }} key={index}>
                <Card.Body>
                  <Card.Title onClick={() => handleUserNavigate(request.requester._id)}>
                    {request.requester.username}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No Requests</p>
          )}
          <Button onClick={() => navigate('/search')}>Find Friends</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
