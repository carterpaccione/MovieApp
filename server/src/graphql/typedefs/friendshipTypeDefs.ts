import { gql } from 'graphql-tag';

export const friendshipTypeDefs = gql`

    enum FriendshipStatus {
        PENDING
        ACCEPTED
        REJECTED
    }

    type Friendship {
        _id: ID!
        requester: User
        recipient: User
        status: FriendshipStatus
    }

    type Query {
        friendshipStatus(userID: ID!): Friendship
    }

    type Mutation {
        addFriend(recipientID: ID!): Friendship
        acceptFriend(friendshipID: ID!): Friendship
        rejectFriend(friendshipID: ID!): Friendship
        deleteRequest(friendshipID: ID!): ID
        removeFriend(friendshipID: ID!): User
    }
`;