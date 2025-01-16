import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      lists {
        _id
        name
        movies {
          _id
          imdbID
          title
          poster
        }
      }
    }
  }
`;

export const QUERY_USER_SEEN_LIST = gql`
  query seenList {
    seenList {
      _id
      name
      owner {
        _id
      }
      movies {
        _id
        title
        imdbID
      }
    }
  }
`;
