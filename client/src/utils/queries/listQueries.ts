import { gql } from 'graphql-tag';

export const QUERY_USER_LIST_DATA = gql`
    query userListData {
        userListData {
            _id
            name
            movies {
                _id
                title
                imdbID
            }
        }
    }
`;