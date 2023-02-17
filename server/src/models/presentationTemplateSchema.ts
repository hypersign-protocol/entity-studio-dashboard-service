import mongoose, { Document, Schema } from 'mongoose';
export interface IPresentationTemplate extends Document {
  orgDid: string;
  queryType: string;
  domain: string;
  name: string;
  issuerDid: [];
  schemaId: [];
  reason: string;
  required: boolean;
  callbackUrl: string;
  templateOwnerDid: string;
  primaryDid: string;
}
export const PresentationTemplateSchema = new Schema({
  orgDid: { type: String, required: false },
  templateOwnerDid: { type: String, required: true },
  queryType: { type: String, required: true },
  domain: { type: String, required: true },
  name: { type: String, required: false },
  // eslint-disable-next-line
  issuerDid: { type: Array<String>, required: true },
  // eslint-disable-next-line
  schemaId: { type: Array<String>, required: true },
  reason: { type: String, required: true },
  required: { type: Boolean, required: false },
  callbackUrl: { type: String, required: true },
  primaryDid: { type: String, required: true },
});

export default mongoose.model<IPresentationTemplate>('PresentationTemplateSchema', PresentationTemplateSchema);
