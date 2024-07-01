import { Schema, model } from "mongoose";
import { typeList } from "../../constants/constants.js";

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
            enum: typeList,
            default: 'personal',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const ContactsCollection = model('contacts', contactsSchema);


