import { gql } from "@apollo/client";

export const CREATE_ISSUE = gql`
    mutation createIssue($description: String!) {
        createIssue(description: $description) {
            _id
            description
        }
    }
`;
