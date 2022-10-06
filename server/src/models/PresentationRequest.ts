import mongoose, { Schema, Document } from 'mongoose';
export interface IPresentationRequest extends Document {
  challenge: string;
  did: string;
  templateId: string;
  expiresTime: number;
  status: number;
}

export const PresentationRequestSchema = new Schema({
  challenge: { type: String, required: false },
  did: { type: String, required: false },
  templateId: { type: String, required: true },
  expiresTime: { type: Number, required: true },
  status: { type: Number, required: true },
});

export default mongoose.model<IPresentationRequest>('PresentationRequestSchema', PresentationRequestSchema);
