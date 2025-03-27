import { gql } from 'graphql-tag';

export const issueTypeDefs = gql`

enum IssueStatus {
    PENDING
    RESOLVED
}

type Issue {
    _id: ID!
    user: User
    description: String!
}

type Mutation {
    createIssue(description: String!): Issue
}
`;