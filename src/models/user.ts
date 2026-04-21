import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content : string;
    createdAt: Date;
    inboxType: "general" | "custom";
    customLinkId?: mongoose.Types.ObjectId | null;
}

export interface CustomLink {
    _id?: mongoose.Types.ObjectId;
    productName: string;
    slug: string;
    isActive: boolean;
    createdAt: Date;
}
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verificationcode: string;
    verificationcodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
    customLinks: CustomLink[];
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: [true, "Content is required"] },
    createdAt: { type: Date, default: Date.now() },
    inboxType: { type: String, enum: ["general", "custom"], default: "general" },
    customLinkId: { type: Schema.Types.ObjectId, default: null },
});

const CustomLinkSchema: Schema<CustomLink> = new Schema({
    productName: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, required: [true, "Slug is required"], trim: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() }
});

const UserSchema: Schema<User> = new Schema({
    username: { type: String, required: [true, "Username is required"], unique: true },
    email: { type: String, required: [true, "Email is required"], unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
    password: { type: String, required: [true, "Password is required"] },
    verificationcode: { type: String },
    verificationcodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    isAcceptingMessages: { type: Boolean, default: true },
    messages: [MessageSchema],
    customLinks: { type: [CustomLinkSchema], default: [] }
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;