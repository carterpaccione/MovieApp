import { model, Schema, type Document } from "mongoose";
import { IUser } from "./User.js";

export enum IssueStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export interface IIssue extends Document {
  user?: IUser;
  description: string;
  status: IssueStatus;
}

export const issueSchema = new Schema<IIssue>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(IssueStatus),
    default: IssueStatus.PENDING,
  },
});

const Issue = model<IIssue>("Issue", issueSchema);

export default Issue;
