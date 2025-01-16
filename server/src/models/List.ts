import { Schema, model, type Document } from 'mongoose';
import { IMovie } from './Movie.js';
import { IUser } from './User.js';

export interface IList extends Document {
    _id: string;
    name: string;
    owner: IUser;
    movies?: IMovie[];
    createdAt: Date;
}

export const listSchema: Schema<IList> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie',
            required: false,
            unique: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const List = model<IList>('List', listSchema);

export default List;