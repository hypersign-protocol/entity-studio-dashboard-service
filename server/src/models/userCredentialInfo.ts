import mongoose, { Document, Schema } from 'mongoose';
export interface IUserPresentation extends Document {
  holderDid: string;
  credentialId: string;
  credentialDetail: object;
  presentationDump: object;
}

export const UserCredential = new Schema({
  holderDid: { type: String, required: true },
  credentialId: { type: String, required: true },
  credentialDetail: { type: Object, required: true },
  presentationDump: { type: Object, required: true }
});
export default mongoose.model<IUserPresentation>('userCredDetail', UserCredential);
