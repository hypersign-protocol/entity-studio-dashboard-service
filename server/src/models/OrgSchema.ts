import mongoose, { Schema, Document } from "mongoose";
export interface IOrg extends Document {
    userDid: string;
    orgDid: string;
    region: string;
    name: string;
    domain: string;
    logo: string;
}
export const OrgDbSchema = new Schema({
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
    name: { type: String, required: true },
    domain: { type: String, required: false },
    logo: { type: String, required: false },

})

export default mongoose.model<IOrg>('Org', OrgDbSchema) 
