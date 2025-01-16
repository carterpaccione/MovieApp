import { gql } from 'graphql-tag';

export const listTypeDefs = gql`

    type List {
        _id: ID!
        name: String!
        owner: User!
        movies: [Movie]
    }

    input NewListInput {
        name: String!
        owner: ID!
    }

    input AddMovieToListInput {
        listID: ID!
        movieID: ID!
    }

    input RemoveMovieFromListInput {
        listID: ID!
        imdbID: String!
    }

    type Query {
        list(listID: ID!): List
        userListData: [List]
    }

    type Mutation {
        createList(input: NewListInput): List

        addMovieToList(input: AddMovieToListInput!): List
        removeMovieFromList(input: RemoveMovieFromListInput!): List
    }
`;