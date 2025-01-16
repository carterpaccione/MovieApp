import { gql } from 'graphql-tag';

export const friendshipTypeDefs = gql`

    type Friendship {
        _id: ID!
        requester: User
        recipient: User
        status: String
    }

    input NewFriendshipInput {
        requesterId: ID!
    }

    type Mutation {
        addFriend(input: NewFriendshipInput): Friendship
        acceptFriend(friendshipId: ID!): Friendship
        rejectFriend(friendshipId: ID!): Friendship
    }
`;