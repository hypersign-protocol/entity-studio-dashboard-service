import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  orgDid: string;
  userDid: string;
}

export const TeamDbSchema = new Schema({
  orgDid: { type: String, required: true },
  userDid: { type: String, required: true },
});

export default mongoose.model<ITeam>('Team', TeamDbSchema);
