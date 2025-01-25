import { AuthenticationError, IApolloContext } from "../../utils/auth.js";
import Movie from "../../models/Movie.js";
import Rating, { IRating } from "../../models/Rating.js";
import User from "../../models/User.js";

interface RateMovieInput {
  input: {
    movieID: string;
    score: number;
    review: string;
  };
}

export const RatingResolvers = {
  Mutation: {
    addRating: async (
      _parent: any,
      { input }: RateMovieInput,
      context: IApolloContext
    ) => {
      console.log("Input: ", input);
      if (!context.user) {
        throw new AuthenticationError("Not logged in.");
      }
      if (!input.movieID) {
        throw new Error(
          "This movie is not in our database. Mark it as Seen or add to your Watchlist to add it."
        );
      }
      try {
        const movie = await Movie.findOne({ _id: input.movieID }).populate(
          "ratings"
        );
        if (!movie) {
          throw new Error(
            "Movie not found in our database, Mark as Seen to udpate it."
          );
        }
        const userCheck = await User.findOne({
          _id: context.user._id,
          "movies.movie": input.movieID,
        });
        if (!userCheck) {
          throw new Error(
            "You must mark the movie as Seen before adding a rating."
          );
        }
        let rating: IRating | null = await Rating.findOne({
          user: context.user._id,
          movie: input.movieID,
        });
        if (rating) {
          rating.score = input.score;
          rating.review = input.review;
          await rating.save();
          return rating;
        } else {
          rating = await Rating.create({
            user: context.user._id,
            movie: input.movieID,
            score: input.score,
            review: input.review,
          });
          await Movie.findByIdAndUpdate(
            { _id: input.movieID },
            {
              $push: { ratings: rating._id },
            },
            { runValidators: true, new: true }
          );
          await User.findOneAndUpdate(
            { _id: context.user._id, "movies.movie": input.movieID },
            { $set: { "movies.$.rating": rating._id } },
            { new: true }
          );
        }
        return rating;
      } catch (error) {
        console.error("Error adding rating:", error);
        throw new Error("Could not add rating.");
      }
    },
  },
};
