import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "../styles/myProfile.css";

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
        <Button
          className="button"
          id="add-friend-button"
          onClick={handleAddButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
          </svg>
        </Button>
      );
    }

    const { status, recipient } = friendshipStatus.friendshipStatus;

    if (status === "PENDING" && recipient._id === idParams.userID) {
      return (
        <Button
          className="button"
          id="remove-request-button"
          onClick={handleDeleteRequestButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="m696-440-56-56 83-84-83-83 56-57 84 84 83-84 57 57-84 83 84 84-57 56-83-83-84 83Zm-336-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
          </svg>
        </Button>
      );
    }

    if (status === "PENDING" && recipient._id !== idParams.userID) {
      return (
        <>
          <Button
            className="button"
            id="accept-friend-button"
            onClick={handleAcceptButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M702-480 560-622l57-56 85 85 170-170 56 57-226 226Zm-342 0q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 260Zm0-340Z" />
            </svg>
          </Button>
          <Button
            className="button"
            id="reject-friend-button"
            onClick={handleRejectButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="m696-440-56-56 83-84-83-83 56-57 84 84 83-84 57 57-84 83 84 84-57 56-83-83-84 83Zm-336-40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
            </svg>
          </Button>
        </>
      );
    }
    return (
      <Button
        className="button"
        id="remove-friend-button"
        onClick={handleRemoveButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000000"
        >
          <path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
        </svg>
      </Button>
    );
  };

  useEffect(() => {
    userDataRefetch();
    friendshipStatusRefetch();
  }, [idParams.userID, friendshipStatus]);

  if (userDataLoading) return <div>Loading...</div>;
  if (userDataError) return <div>Error!</div>;

  return (
    <Container className="page-container">
      <Row
        className="justify-content-md-center text-center"
        id="profile-header"
      >
        <Row>
          <h2>{userData.userByID.username}'s Profile</h2>
        </Row>
        <Row>{checkFriendshipStatus()}</Row>
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
