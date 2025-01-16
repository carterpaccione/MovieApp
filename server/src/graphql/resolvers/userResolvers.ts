import {
  signToken,
  AuthenticationError,
  IApolloContext,
} from "../../utils/auth.js";
import User from "../../models/User.js";
import List from "../../models/List.js";

interface NewUserInput {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserInput {
  input: {
    username: string;
    password: string;
  };
}

export const UserResolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: IApolloContext) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        return await User.findOne({ _id: context.user._id }).populate([
          {
            path: "lists",
            select: "name _id",
            populate: [
              {
                path: "movies",
                select: "title _id imdbID poster",
              },
            ]
          }
        ]);
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user.");
      }
    },
    user: async (_parent: any, userId: string, context: IApolloContext) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
          throw new Error("User not found.");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user.");
      }
    },
    seenList: async (_parent: any, _args: any, context: IApolloContext) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const userData = await User.findOne({ _id: context.user._id });
        if (!userData) {
          throw new Error("User not found.");
        }
        const seenList = await List.findOne({ owner: userData._id, name: "Seen" }).populate("owner").populate("movies");
        return seenList;
      } catch (error) {
        console.error("Error fetching list:", error);
        throw new Error("Could not fetch list.");
      }
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: NewUserInput) => {
      try {
        const user = await User.create({ ...input });
        const token = signToken(user.username, user.email, user._id);
        const seenList = await List.create({ name: "Seen", owner: user._id });
        const watchList = await List.create({ name: "WatchList", owner: user._id });
        await User.findByIdAndUpdate(user._id, { $addToSet: { lists: seenList._id } });
        await User.findByIdAndUpdate(user._id, { $addToSet: { lists: watchList._id } });
        return { token, user };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Could not create user.");
      }
    },
    login: async (_parent: any, { input }: LoginUserInput) => {
      const user = await User.findOne({ username: input.username });
      if (!user) {
        throw new Error("Incorrect username.");
      }

      const correctPw = await user.isCorrectPassword(input.password);
      if (!correctPw) {
        throw new Error("Incorrect password.");
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  },
};
