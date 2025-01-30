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
    console.log(
      "LocalStorage ID: ",
      myInfo._id.trim(),
      "UserID: ",
      userID.trim()
    );
    if (myInfo._id === userID) {
      navigate(`/me`);
    } else {
      navigate(`/users/${userID}`);
    }
  };

  useEffect(() => {
    userDataRefetch();
    friendshipStatusRefetch();
  }, [idParams.userID, friendshipStatus]);

  const handleAddButton = async () => {
    try {
      await addFriend({
        variables: { recipientID: idParams.userID },
      });
      friendshipStatusRefetch();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleAcceptButton = async () => {
    try {
      await acceptFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
      friendshipStatusRefetch();
    } catch (error) {
      console.error("Error accepting friend:", error);
    }
  };

  const handleRejectButton = async () => {
    try {
      await rejectFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
      friendshipStatusRefetch();
    } catch (error) {
      console.error("Error rejecting friend:", error);
    }
  };

  const handleDeleteRequestButton = async () => {
    try {
      await deleteRequest({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
        update(cache) {
          cache.modify({
            fields: {
              friendshipStatus() {
                return null;
              },
            },
          });
        },
      });
    } catch (error) {
      console.error("Error deleting request:", error);
    }
    await friendshipStatusRefetch();
  };

  const handleRemoveButton = async () => {
    try {
      await removeFriend({
        variables: { friendshipID: friendshipStatus?.friendshipStatus._id },
      });
      friendshipStatusRefetch();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const checkFriendshipStatus = () => {
    if (!friendshipStatus || !friendshipStatus.friendshipStatus) {
      return <Button onClick={handleAddButton}>+ Friend</Button>;
    }

    const { status, recipient } = friendshipStatus.friendshipStatus;

    if (status === "PENDING" && recipient._id === idParams.userID) {
      return <Button onClick={handleDeleteRequestButton}>- Request</Button>;
    }

    if (status === "PENDING" && recipient._id !== idParams.userID) {
      return (
        <>
          <Button onClick={handleAcceptButton}>Accept</Button>
          <Button onClick={handleRejectButton}>Reject</Button>
        </>
      );
    }
    return <Button onClick={handleRemoveButton}>Remove Friend</Button>;
  };

  if (userDataLoading) return <div>Loading...</div>;
  if (userDataError) return <div>Error!</div>;
  console.log("userData: ", userData);
  console.log("friendshipStatus: ", friendshipStatus);

  return (
    <Container>
      <h3>{userData.userByID.username}'s Profile</h3>
      {checkFriendshipStatus()}
      <MovieTable movies={userData.userByID.movies} />
      <Row>
        <Col>
          <h3>FriendsList</h3>
          {userData.userByID.friends.map((friend: any, index: number) => (
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

export default UserProfile;
