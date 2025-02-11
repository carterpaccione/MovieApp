import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    movies: [UserMovie]
    recommendedMovies: [MovieSearch]
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

  input SetRecsInput {
    imdbID: String!
    Title: String!
    Year: String!
    Type: String!
    Poster: String!
  }

  input SetRecsInputWrapper {
    movies: [SetRecsInput!]
  }

  type Query {
    me: User
    userByID(userID: ID!): User
    userMovieData(movieID: ID!): UserMovie
    userListData: User
    userRecommendations: User
  }

  type Mutation {
    addUser(input: NewUserInput!): Auth
    login(input: LoginUserInput!): Auth

    addToSeen(movieID: ID!): User
    addToWatchList(movieID: ID!): User
    removeFromUser(movieID: ID!): User

    setRecommendations(input: SetRecsInputWrapper!): User
  }
`;
