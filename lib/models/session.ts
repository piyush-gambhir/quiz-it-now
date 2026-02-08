import mongoose, { Document, Model, Schema } from 'mongoose';

// Session Interface
export interface ISession extends Document {
    sessionToken: string;
    userId: string;
    expires: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Session Schema
const SessionSchema = new Schema<ISession>(
    {
        sessionToken: { type: String, required: true, unique: true },
        userId: { type: String, required: true, ref: 'User' },
        expires: { type: Date, required: true },
    },
    {
        timestamps: true,
    },
);

// Export Session Model
export const Session: Model<ISession> =
    mongoose.models.Session ||
    mongoose.model<ISession>('Session', SessionSchema);
