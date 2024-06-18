import { Schema, model } from "mongoose";

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        isFavourite: {
            type: Boolean,
            required: false,
            default: false,
        },
        contactType: {
            type: String,
            required: true,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
        },
        createdAt: {
            type: Date,
            required: false,
        },
        updatedAt: {
            type: Date,
            required: false,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ContactsCollection = model('contacts', contactsSchema);


