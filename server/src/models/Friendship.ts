import { Schema, model, type Document } from 'mongoose';
import { IUser } from './User';

export interface IFriendship extends Document {
    requester: IUser;
    recipient: IUser;
    status: string;
    createdAt: Date;
}

export const friendshipSchema: Schema<IFriendship> = new Schema({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Friendship = model<IFriendship>('Friendship', friendshipSchema);

export default Friendship;