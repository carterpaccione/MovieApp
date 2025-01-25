import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

import { IUserMovie } from "../models/Movie";
import { QUERY_USER_BY_ID } from "../utils/queries/userQueries";

const UserProfile = () => {
    const idParams = useParams<{ userID: string }>()
    const { data, loading, error } = useQuery(QUERY_USER_BY_ID, {
        variables: { userID: idParams.userID },
    });
    
    const navigate = useNavigate();
    
    const handleMovieNavigate = (imdbID: string) => {
        navigate(`/movies/${imdbID}`);
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error!</div>;
    console.log("Data:", data);
    
    return (
        <Container>
        <h3>{data.userByID.username}'s Profile</h3>
        {data.userByID.movies.map((userMovie: IUserMovie, index: number) => (
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
                    Rating:{" "}
                    {userMovie.rating.score ? userMovie.rating.score : "Not Yet Rated"}
                </ListGroup.Item>
                </ListGroup>
                {userMovie.rating.review ? (
                <Card.Text>Review: {userMovie.rating.review}</Card.Text>
                ) : null}
            </Card.Body>
            </Card>
        ))}
        </Container>
    );
}

export default UserProfile;