import { gql } from "@apollo/client";

export const QUERY_FRIENDSHIP_STATUS = gql`
    query friendshipStatus($userID: ID!) {
        friendshipStatus(userID: $userID) {
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

export const QUERY_INCOMING_REQUESTS = gql`
    query incomingRequests {
        incomingRequests {
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