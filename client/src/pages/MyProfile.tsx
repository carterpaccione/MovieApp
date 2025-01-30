import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import MovieTable from "../components/movieTable.js";

import { QUERY_ME } from "../utils/queries/userQueries.js";

const MyProfile = () => {
  const { data, loading, error } = useQuery(QUERY_ME);

  const navigate = useNavigate();

  const handleUserNavigate = (userID: string) => {
    navigate(`/users/${userID}`);
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
          <MovieTable movies={data.me.movies} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>FriendsList</h3>
          {data.me.friends.map((friend: any, index: number) => (
            <Card style={{ width: "18rem" }} key={index}>
              <Card.Body>
                <Card.Title onClick={() => handleUserNavigate(friend._id)}>
                  {friend.username}
                </Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
