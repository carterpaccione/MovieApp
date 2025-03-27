import { UserResolvers } from "./userResolvers.js";
import { MovieResolvers } from "./movieResolvers.js";
import { RatingResolvers } from "./ratingResolvers.js";
import { FriendshipResolvers } from "./friendshipResolvers.js";
import { IssueResolvers } from "./issueResolvers.js";

const resolvers = [
    UserResolvers,
    MovieResolvers,
    RatingResolvers,
    FriendshipResolvers,
    IssueResolvers
]

export default resolvers;