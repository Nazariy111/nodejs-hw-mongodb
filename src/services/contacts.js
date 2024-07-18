
import { ContactsCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
    filter = {},
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = 'name', }) => {

    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if (filter.userId) {
        contactsQuery.where("userId").equals(filter.userId);
    };

    if(filter.isFavourite) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    };

    const contactsCount = await ContactsCollection.find().merge(contactsQuery).countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};




export const getContactById = async (filter) => {
    const contact = await ContactsCollection.findOne(filter);
    return contact;
};


export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};


export const updateContact = async (contactId, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};


export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
    });

    return contact;
};
