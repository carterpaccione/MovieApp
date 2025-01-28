import {
  signToken,
  AuthenticationError,
  IApolloContext,
} from "../../utils/auth.js";
import User from "../../models/User.js";
import Rating from "../../models/Rating.js";
import Movie from "../../models/Movie.js";

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

interface UserMovieArgs {
  movieID: string;
}

export const UserResolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: IApolloContext) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: context.user._id }).populate([
          {
            path: "movies",
            select: "movie status rating _id",
            populate: [
              { path: "movie", select: "title imdbID poster _id" },
              { path: "rating", select: "score review _id" },
            ],
          },
          {
            path: "friends",
            select: "username _id"
          }
        ]);
        console.log("user:", user);
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user.");
      }
    },
    userByID: async (
      _parent: any,
      { userID }: { userID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: userID }).populate([
          {
            path: "movies",
            select: "movie status rating _id",
            populate: [
              { path: "movie", select: "title imdbID poster _id" },
              { path: "rating", select: "score review _id" },
            ],
          },
          {
            path: "friends",
            select: "username _id"
          }
        ]);
        if (!user) {
          throw new Error("User not found.");
        }
        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Could not fetch user.");
      }
    },
    userMovieData: async (
      _parent: any,
      { movieID }: UserMovieArgs,
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const userData = await User.findOne({
          _id: context.user._id,
          movies: { $elemMatch: { movie: movieID } },
        })
        .populate([
          {
            path: "movies",
            select: "movie status rating _id",
            populate: [
              {
                path: "movie",
                select: "title imdbID poster averageRating _id",
              },
              {
                path: "rating",
                select: "score review _id",
              },
            ],
          },
        ]);
        if (!userData) {
          throw new Error("User movie data not found.");
        }
        console.log("userData:", userData);
        const userMovieData = userData.movies.find(
          (movie) => movie.movie._id.toString() === movieID
        );
        console.log("userMovieData:", userMovieData);
        return userMovieData;
      } catch (error) {
        console.error("Error fetching user movie data:", error);
        throw new Error("Could not fetch user movie data.");
      }
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: NewUserInput) => {
      try {
        const user = await User.create({ ...input });
        const token = signToken(user.username, user.email, user._id);
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
    addToSeen: async (
      _parent: any,
      { movieID }: { movieID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: context.user._id });
        if (!user) {
          throw new Error("User not found.");
        }
        const check = user.movies.find(
          (movie) => movie.movie.toString() === movieID
        );
        if (check) {
          console.log("Movie already in user's list.");
          let updatedUser = await User.findByIdAndUpdate(
            { _id: user._id },
            {
              $set: { movies: { movie: movieID, status: "SEEN" } },
            },
            { runValidators: true, new: true }
          );
          console.log("Updated User:", updatedUser);
          return updatedUser;
        }
        let updatedUser = await User.findByIdAndUpdate(
          { _id: user._id },
          {
            $push: { movies: { movie: movieID, status: "SEEN" } },
          },
          { runValidators: true, new: true }
        );
        return updatedUser;
      } catch (error) {
        console.error("Error adding movie to user:", error);
        throw new Error("Could not add movie to user.");
      }
    },
    addToWatchList: async (
      _parent: any,
      { movieID }: { movieID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: context.user._id });
        if (!user) {
          throw new Error("User not found.");
        }
        const check = user.movies.find(
          (movie) => movie.movie.toString() === movieID
        );
        if (check) {
          console.log("Movie already in user's list.");
          let updatedUser = await User.findByIdAndUpdate(
            { _id: user._id },
            {
              $set: { movies: { movie: movieID, status: "WATCH_LIST" } },
            },
            { runValidators: true, new: true }
          );
          console.log("Updated User:", updatedUser);
          return updatedUser;
        }
        let updatedUser = await User.findByIdAndUpdate(
          { _id: user._id },
          {
            $push: { movies: { movie: movieID, status: "WATCH_LIST" } },
          },
          { runValidators: true, new: true }
        );
        return updatedUser;
      } catch (error) {
        console.error("Error adding movie to user:", error);
        throw new Error("Could not add movie to user.");
      }
    },
    removeFromUser: async (
      _parent: any,
      { movieID }: { movieID: string },
      context: IApolloContext
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      try {
        const user = await User.findOne({ _id: context.user._id });
        if (!user) {
          throw new Error("User not found.");
        }
        const checkRating = await Rating.findOne({
          movie: movieID,
          user: context.user._id,
        });
        if (checkRating) {
          await Rating.findByIdAndDelete(checkRating._id);
          const updatedMovie = await Movie.findByIdAndUpdate(
            { _id: movieID },
            { $pull: { ratings: checkRating._id } },
            { new: true }
          );
          if (updatedMovie) {
            updatedMovie.averageRating = updatedMovie.calculateAverageRating();
          }
        }
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $pull: { movies: { movie: movieID } } },
          { new: true }
        );
        return updatedUser;
      } catch (error) {
        console.error("Error removing movie from user:", error);
        throw new Error("Could not remove movie from user.");
      }
    },
  },
};
