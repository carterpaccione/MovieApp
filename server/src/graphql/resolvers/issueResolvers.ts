import { IApolloContext } from '../../utils/auth.js';
import Issue from '../../models/Issue.js';

export const IssueResolvers = {
    Query: {
    },
    Mutation: {
        createIssue: async (_parent: any, { description }: { description: string }, context: IApolloContext) => {
            try {
                if (!context.user) {
                    const issue = await Issue.create({ description: description });
                    return issue;
                } else {
                    const issue = await Issue.create({ user: context.user._id, description: description });
                    return issue;
                }
            } catch (error: any) {
                console.error("Error creating issue:", error);
                throw new Error("Error creating issue");
            }
        },
    },
};