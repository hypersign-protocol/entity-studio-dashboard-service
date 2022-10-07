import mongoose, { Document, Schema } from 'mongoose';
export interface IUser extends Document {
  did: string;
  email: string;
  name: string;
}

const userDbSchema = new Schema({
  did: {
    type: String,
    requird: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: { type: String, required: false },
});

export default mongoose.model<IUser>('User', userDbSchema);
