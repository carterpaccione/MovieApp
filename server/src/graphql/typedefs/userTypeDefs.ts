import { gql } from 'graphql-tag';

export const userTypeDefs = gql`

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        lists: [List]
        friends: [User]
    }

    type Auth {
        token: ID!
        user: User
    }

    input NewUserInput {
        username: String!
        email: String!
        password: String!
    }

    input LoginUserInput {
        username: String!
        password: String!
    }

    type Query {
        testContext: String
        me: User
        user(userID: ID!): User
        
        seenList: List
    }

    type Mutation {
        addUser(input: NewUserInput!): Auth
        login(input: LoginUserInput!): Auth

        createList(name: String!): List
        deleteList(listId: ID!): User
    }
`;
