import Movie from "../../models/Movie.js";

interface saveMovieToDBInput {
  input: {
    title: string;
    imdbID: string;
    poster: string;
  };
}

export const MovieResolvers = {
  Query: {
    movie: async (_parent: any, { imdbID }: { imdbID: string}) => {
      try {
        const movie = await Movie.findOne({ imdbID: imdbID })
        .populate([
          {
            path: "ratings",
            select: "score review averageRating createdAt",
            populate: {
              path: "user",
              select: "username _id"
            }
          }
        ]);
        if (!movie) {
          throw new Error("Movie not found.");
        }
        movie.calculateAverageRating();
        return movie;
      } catch (error) {
        console.error("Error fetching movie:", error);
        throw new Error("Could not fetch movie.");
      }
    },
  },
  Mutation: {
    saveMovieToDB: async (_parent: any, { input }: saveMovieToDBInput) => {
      try {
        const check = await Movie.findOne({ imdbID: input.imdbID });
        if (check) {
          return check;
        } else {
          const newMovie = await Movie.create({ ...input });
          return newMovie;
        }
      } catch (error) {
        console.error("Error saving movie to database:", error);
        throw new Error("Could not save movie to database.");
      }
    },
  },
};
