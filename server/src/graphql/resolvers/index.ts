import { UserResolvers } from "./userResolvers.js";
import { MovieResolvers } from "./movieResolvers.js";
import { RatingResolvers } from "./ratingResolvers.js";

const resolvers = [
    UserResolvers,
    MovieResolvers,
    RatingResolvers
]

export default resolvers;