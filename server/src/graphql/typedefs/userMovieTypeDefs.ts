import { gql } from "graphql-tag";

export const userMovieTypeDefs = gql`
  enum MovieStatus {
    SEEN
    WATCH_LIST
    NONE
  }

  type UserMovie {
    movie: Movie
    status: MovieStatus
    rating: Rating
  }
`;
