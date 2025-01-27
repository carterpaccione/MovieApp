import { gql } from "@apollo/client";

export const ADD_FRIEND = gql`
  mutation addFriend($recipientID: ID!) {
    addFriend(recipientID: $recipientID) {
      _id
      requester {
        _id
      }
      recipient {
        _id
      }
      status
    }
  }
`;

export const ACCEPT_FRIEND = gql`
  mutation acceptFriend($friendshipID: ID!) {
    acceptFriend(friendshipID: $friendshipID) {
      _id
      requester {
        _id
        username
      }
      recipient {
        _id
        username
      }
      status
    }
  }
`;

export const REJECT_FRIEND = gql`
  mutation rejectFriend($friendshipID: ID!) {
    rejectFriend(friendshipID: $friendshipID) {
      _id
      requester {
        _id
        username
      }
      recipient {
        _id
        username
      }
      status
    }
  }
`;

export const DELETE_REQUEST = gql`
  mutation deleteRequest($friendshipID: ID!) {
    deleteRequest(friendshipID: $friendshipID)
  }
`;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($friendshipID: ID!) {
    removeFriend(friendshipID: $friendshipID) {
      _id
      username
    }
  }
`;