import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation addUser($input: NewUserInput!) {
        addUser(input: $input) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN = gql`
    mutation login($input: LoginUserInput!) {
        login(input: $input) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;