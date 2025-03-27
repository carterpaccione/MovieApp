import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUserMovie, userMovieSchema } from './UserMovie.js'
import { IMovieSearch, movieSearchSchema } from "./MovieSearch.js";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
  
  movies: IUserMovie[]
  recommendedMovies?: IMovieSearch[];
  friends?: IUser[];
}

export const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  movies: [userMovieSchema],
  recommendedMovies: [movieSearchSchema],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
