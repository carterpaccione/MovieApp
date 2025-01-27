import { IUser } from './User';

enum FriendshipStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export interface IFriendship {
    _id: string;
    requester: IUser;
    recipient: IUser;
    status: FriendshipStatus;
    createdAt: Date;
}