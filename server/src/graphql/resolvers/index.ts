import { UserResolvers } from "./userResolvers.js";
import { MovieResolvers } from "./movieResolvers.js";
import { RatingResolvers } from "./ratingResolvers.js";
import { FriendshipResolvers } from "./friendshipResolvers.js";

const resolvers = [
    UserResolvers,
    MovieResolvers,
    RatingResolvers,
    FriendshipResolvers,
]

export default resolvers;