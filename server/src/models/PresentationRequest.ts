import mongoose, { Schema, Document } from 'mongoose';
export interface IPresentationRequest extends Document {
  challenge: string;
  did: string;
  templateId: string;
  expiresTime: number;
  status: number;
  accessToken: string;
}

export const PresentationRequestSchema = new Schema({
  challenge: { type: String, required: false },
  did: { type: String, required: false },
  templateId: { type: String, required: true },
  expiresTime: { type: Number, required: true },
  status: { type: Number, required: true },
  accessToken: { type: String, required: false },
});

export default mongoose.model<IPresentationRequest>('PresentationRequestSchema', PresentationRequestSchema);
