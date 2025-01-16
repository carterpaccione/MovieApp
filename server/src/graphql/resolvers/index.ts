import { UserResolvers } from "./userResolvers.js";
import { FriendshipResolvers } from "./friendshipResolvers.js";
import { MovieResolvers } from "./movieResolvers.js";
import { ListResolvers } from "./listResolvers.js";

const resolvers = [
    UserResolvers,
    FriendshipResolvers,
    MovieResolvers,
    ListResolvers
]

export default resolvers;