import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import MovieTable from "../components/movieTable";

import { QUERY_USER_BY_ID } from "../utils/queries/userQueries";
import { QUERY_FRIENDSHIP_STATUS } from "../utils/queries/friendshipQueries";
import {
  ADD_FRIEND,
  ACCEPT_FRIEND,
  REJECT_FRIEND,
  DELETE_REQUEST,
  REMOVE_FRIEND,
} from "../utils/mutations/friendshipMutations";

const UserProfile = () => {
  const idParams = useParams<{ userID: string }>();
  const {
    data: userData,
    loading: userDataLoading,
    error: userDataError,
    refetch: userDataRefetch,
  } = useQuery(QUERY_USER_BY_ID, {
    variables: { userID: idParams.userID },
  });
  const { data: friendshipStatus, refetch: friendshipStatusRefetch } = useQuery(
    QUERY_FRIENDSHIP_STATUS,
    {
      variables: { userID: idParams.userID },
    }
  );

  const [addFriend] = useMutation(ADD_FRIEND);
  const [acceptFriend] = useMutation(ACCEPT_FRIEND);
  const [rejectFriend] = useMutation(REJECT_FRIEND);
  const [deleteRequest] = useMutation(DELETE_REQUEST);
  const [removeFriend] = useMutation(REMOVE_FRIEND);

  const navigate = useNavigate();
  const handleUserNavigate = (userID: string) => {
    let myInfo = JSON.parse(localStorage.getItem("user") || "{}");
    if (myInfo._id === userID) {
      navigate(`/me`);
    } else {
      navigate(`/users/${userID}`);
    }
  };

  const handleAddButton = async () => {
    try {
      await addFriend({
        variables: { recipientID: idParams.userID },
      });
    } catch (error) {
      console.error("Error adding friend:", error);
    }
    friendshipStatusRefetch();
  };

  const handleAcceptButton = async () => {
    try {
      await acceptFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
    } catch (error) {
      console.error("Error accepting friend:", error);
    }
    friendshipStatusRefetch();
  };

  const handleRejectButton = async () => {
    try {
      await rejectFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
    } catch (error) {
      console.error("Error rejecting friend:", error);
    }
    friendshipStatusRefetch();
  };

  const handleDeleteRequestButton = async () => {
    try {
      await deleteRequest({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
    friendshipStatusRefetch();
  };

  const handleRemoveButton = async () => {
    try {
      await removeFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
      await userDataRefetch();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
    await friendshipStatusRefetch();
  };

  const checkFriendshipStatus = () => {
    if (
      !friendshipStatus ||
      !friendshipStatus.friendshipStatus ||
      friendshipStatus.friendshipStatus == null
    ) {
      return (
        <Button className="button" onClick={handleAddButton}>
          + Friend
        </Button>
      );
    }

    const { status, recipient } = friendshipStatus.friendshipStatus;

    if (status === "PENDING" && recipient._id === idParams.userID) {
      return (
        <Button className="button" onClick={handleDeleteRequestButton}>
          - Request
        </Button>
      );
    }

    if (status === "PENDING" && recipient._id !== idParams.userID) {
      return (
        <>
          <Button className="button" onClick={handleAcceptButton}>
            Accept
          </Button>
          <Button className="button" onClick={handleRejectButton}>
            Reject
          </Button>
        </>
      );
    }
    return (
      <Button className="button" onClick={handleRemoveButton}>
        Remove Friend
      </Button>
    );
  };

  useEffect(() => {
    userDataRefetch();
    friendshipStatusRefetch();
  }, [idParams.userID, friendshipStatus]);

  if (userDataLoading) return <div>Loading...</div>;
  if (userDataError) return <div>Error!</div>;
  console.log("userData: ", userData);
  console.log("friendshipStatus: ", friendshipStatus);

  return (
    <Container className="page-container">
      <Row className="justify-content-md-center text-center">
        <h3>{userData.userByID.username}'s Profile</h3>
        {checkFriendshipStatus()}
      </Row>
      <Row>
        <Col>
          <MovieTable movies={userData.userByID.movies} />
        </Col>
        <Col id="friends-container">
          <h3>FriendsList</h3>
          {userData.userByID.friends.length > 0 ? (
            userData.userByID.friends.map((friend: any, index: number) => (
              <Card className="friend-card" key={index}>
                <Card.Body>
                  <Card.Title onClick={() => handleUserNavigate(friend._id)}>
                    {friend.username}
                  </Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No Friends Yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
