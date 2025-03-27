import { IUser } from './User';

export enum IssueStatus {
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
}

export interface IIssue {
    user?: IUser;
    description: string;
    status?: IssueStatus;
}

export default IIssue;