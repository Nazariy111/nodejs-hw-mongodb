import { Schema, model } from "mongoose";
import { emailRegexp } from '../../constants/users-constants.js';

const usersSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, match: emailRegexp, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const UsersCollection = model('users', usersSchema);


