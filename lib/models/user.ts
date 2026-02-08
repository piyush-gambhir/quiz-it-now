import mongoose, { Document, Model, Schema } from 'mongoose';

// User Interface
export interface IUser extends Document {
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: false },
        email: { type: String, required: false, unique: true },
        emailVerified: { type: Date, required: false },
        image: { type: String, required: false },
    },
    {
        timestamps: true,
    },
);

// Export User Model
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
