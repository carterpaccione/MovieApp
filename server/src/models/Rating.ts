import { Schema, model, type Document } from 'mongoose';
import { IUser } from './User.js';
import { IMovie } from './Movie.js';

export interface IRating extends Document {
    _id: string;
    movie: IMovie;
    user: IUser;
    score: number;
    review?: string;
    createdAt: Date;
}

export const ratingSchema: Schema<IRating> = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    review: {
        type: String,
        trim: true,
        maxlength: 300,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Rating = model<IRating>('Rating', ratingSchema);

export default Rating;