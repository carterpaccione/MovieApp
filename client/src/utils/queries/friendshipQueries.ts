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