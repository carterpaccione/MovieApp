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
import MovieCard from "../components/movieCard.js";

import { QUERY_ME } from "../utils/queries/userQueries.js";
import { QUERY_INCOMING_REQUESTS } from "../utils/queries/friendshipQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const {
    data: requestsData,
    loading: requestsLoading,
    error: requestsError,
  } = useQuery(QUERY_INCOMING_REQUESTS);

  const [incomingRequests, setIncomingRequests] = useState<IFriendship[]>([]);

  useEffect(() => {
    if (requestsData) {
      setIncomingRequests(requestsData.incomingRequests);
    }
  }, [requestsData]);

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
      <Row className="justify-content-md-center text-center"
        id="profile-header">
        <h2>{data.me.username}'s Profile</h2>
      </Row>
      <Row>
        <Col id="recommended-container">
          <h4>For You</h4>
          {data.me.recommendedMovies.length > 0 ? (
            data.me.recommendedMovies.map((movie: MovieSearch) => (
              <MovieCard
                movie={{
                  Title: movie.Title,
                  Poster: movie.Poster,
                  imdbID: movie.imdbID,
                  Year: movie.Year,
                }}
                key={`rec-${movie.imdbID}`}
                onClick={() => {
                  handleMovieNavigate(movie.imdbID);
                }}
              />
            ))
          ) : (
            <p>No recommendations available.</p>
          )}
        </Col>
        <Col>
          <MovieTable movies={data.me.movies} />
        </Col>
        <Col id="friends-container">
          <h3>Friends</h3>
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
              <Card className="friend-card" key={index}>
                <Card.Body>
                  <Card.Title
                    onClick={() => handleUserNavigate(request.requester._id)}
                  >
                    {request.requester.username}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No Requests</p>
          )}
          <Button className="button" title="Find Friends" onClick={() => navigate("/search")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M440-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T520-640q0-33-23.5-56.5T440-720q-33 0-56.5 23.5T360-640q0 33 23.5 56.5T440-560ZM884-20 756-148q-21 12-45 20t-51 8q-75 0-127.5-52.5T480-300q0-75 52.5-127.5T660-480q75 0 127.5 52.5T840-300q0 27-8 51t-20 45L940-76l-56 56ZM660-200q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-540 40v-111q0-34 17-63t47-44q51-26 115-44t142-18q-12 18-20.5 38.5T407-359q-60 5-107 20.5T221-306q-10 5-15.5 14.5T200-271v31h207q5 22 13.5 42t20.5 38H120Zm320-480Zm-33 400Z" />
            </svg>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
