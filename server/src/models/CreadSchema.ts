import mongoose, { Document, Schema } from "mongoose";
export interface ICreadSchema extends Document {
    issuerDid: string;
    subjectDid:string;
    transactionHash:string;
    schemaId:string;
    createdAt: Date;
    status: string;
   
}

export const creadSchema = new Schema({
    issuerDid: { type: String, required: true },
    subjectDid: { type: String, required: true },
    transactionHash:{
        type: String, required:false,
    },
    schemaId:{
        type: String, required:true,
    
    },
    status: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
    }
})
export default mongoose.model<ICreadSchema>('CreadSchema', creadSchema)