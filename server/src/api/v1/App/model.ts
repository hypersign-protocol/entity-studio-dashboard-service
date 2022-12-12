import mongoose, { Schema, Document } from 'mongoose';
export interface IApp extends Document {
  appName: string;
  userId: string;
  clientId: string;
  clientSecret: string;
  tenantSubdomain: string;
  kmsId: string;
  edvId: string;
}

export const appSchema = new Schema({
  appName: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  tenantSubdomain: { type: String, required: true },
  kmsId: { type: String, required: true },
  edvId: { type: String, required: true },
});

export default mongoose.model<IApp>('app', appSchema);
