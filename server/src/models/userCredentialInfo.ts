import mongoose, { Document, Schema } from 'mongoose';
export interface IUserPresentation extends Document {
  holderDid: string;
  credentialId: string;
  credentialDetail: object;
  presentation: object;
}

export const UserCredential = new Schema({
  holderDid: { type: String, required: true },
  credentialId: { type: String, required: true },
  credentialDetail: { type: Object, required: true },
  presentation: { type: Object, required: true }
});
export default mongoose.model<IUserPresentation>('userCredDetail', UserCredential);
