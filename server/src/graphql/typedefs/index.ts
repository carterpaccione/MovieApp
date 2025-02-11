import { userTypeDefs } from './userTypeDefs.js';
import { friendshipTypeDefs } from './friendshipTypeDefs.js';
import { ratingTypeDefs } from './ratingTypeDefs.js';
import { movieTypeDefs } from './movieTypeDefs.js';
import { userMovieTypeDefs } from './userMovieTypeDefs.js';
import { movieSearchTypeDefs } from './movieSearchTypeDefs.js';

const typeDefs = [userTypeDefs, friendshipTypeDefs, ratingTypeDefs, movieTypeDefs, userMovieTypeDefs, movieSearchTypeDefs];

export default typeDefs;