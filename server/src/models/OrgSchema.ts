import mongoose, { Schema, Document } from 'mongoose';
export interface IOrg extends Document {
  userDid: string;
  orgDid: string;
  region: string;
  name: string;
  domain: string;
  logo: string;
  status: string;
  schemasCount: number;
  templatesCount: number;
  credentialsCount: number;
}
export const OrgDbSchema = new Schema({
  status: {
    type: String,
    required: false,
  },
  userDid: {
    type: String,
    required: true,
  },
  orgDid: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: false,
  },
  logo: {
    type: String,
    required: false,
  },
  schemasCount: {
    type: Number,
    required: false,
    default: 0,
  },
  templatesCount: {
    type: Number,
    required: false,
    default: 0,
  },
  credentialsCount: {
    type: Number,
    required: false,
    default: 0,
  },
});

export default mongoose.model<IOrg>('Org', OrgDbSchema);
