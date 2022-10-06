import mongoose, { Document, Schema } from 'mongoose';
export interface ISchema extends Document {
  orgDid: string;
  did: string;
  transactionHash: string;
  schemaId: string;
  createdAt: Date;
  status: string;
}

export const SchemaDbSchema = new Schema({
  orgDid: { reqired: false, type: String },
  did: { type: String, required: true },
  transactionHash: {
    type: String,
    required: false,
  },
  schemaId: {
    type: String,
    required: false,
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
export default mongoose.model<ISchema>('Schema', SchemaDbSchema);
