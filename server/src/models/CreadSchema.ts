import mongoose, { Document, Schema } from 'mongoose';
export interface ICreadSchema extends Document {
  issuerDid: string;
  subjectDid: string;
  transactionHash: string;
  schemaId: string;
  createdAt: Date;
  status: string;
  vc: JSON;
  vc_id: string;
  orgDid: string;
}

export const creadSchema = new Schema({
  orgDid: { reqired: false, type: String },
  vc_id: {
    type: String,
    required: false,
  },
  issuerDid: { type: String, required: true },
  subjectDid: { type: String, required: true },
  transactionHash: {
    type: String,
    required: false,
  },
  vc: {
    type: JSON,
    required: false,
  },
  schemaId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});
export default mongoose.model<ICreadSchema>('CreadSchema', creadSchema);
