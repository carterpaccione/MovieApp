import { Schema, model, type Document } from 'mongoose';
import { IRating } from './Rating.js';

export interface IMovie extends Document {
    _id: string;
    title: string;
    imdbID: string;
    poster: string;
    ratings?: IRating[];
    calculateAverageRating(): number;
    averageRating?: number;
};

export const movieSchema: Schema<IMovie> = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    imdbID: {
        type: String,
        required: true,
        unique: true
    },
    poster: {
        type: String,
        required: true
    },
    ratings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ]
});

movieSchema.methods.calculateAverageRating = function () {
    this.averageRating = this.ratings.reduce((acc: number, rating: IRating) => acc + rating.score, 0) / this.ratings.length;
}

const Movie = model<IMovie>('Movie', movieSchema);

export default Movie;