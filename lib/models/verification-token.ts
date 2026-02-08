import mongoose, { Document, Model, Schema } from 'mongoose';

// VerificationToken Interface
export interface IVerificationToken extends Document {
    identifier: string;
    token: string;
    expires: Date;
}

// VerificationToken Schema
const VerificationTokenSchema = new Schema<IVerificationToken>({
    identifier: { type: String, required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
});

// Unique index
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

// Export VerificationToken Model
export const VerificationToken: Model<IVerificationToken> =
    mongoose.models.VerificationToken ||
    mongoose.model<IVerificationToken>(
        'VerificationToken',
        VerificationTokenSchema,
    );
