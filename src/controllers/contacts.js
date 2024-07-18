import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import parseFilterParams from "../utils/parseFilterParams.js";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
    const { _id: userId } = req.user;

    const { page, perPage } = parsePaginationParams(req.query);

    const { sortBy, sortOrder } = parseSortParams(req.query);

    const filter = { ...parseFilterParams(req.query), userId };

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });

    res.json({
        status: 200,
        data: contacts,
        message: "Successfully found contacts!",
    });
};


export const getContactByIdController = async (req, res,next) => {
    try {
        const { _id: userId } = req.user;
        const { contactId } = req.params;
        const contact = await getContactById({_id: contactId, userId});

        if (!contact) {
            next(createHttpError(404, 'Contact not found'));
            return;
        };
        res.json({
            status: 200,
            data: contact,
            message: `Successfully found contact with id ${contactId}`,
        });
    } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            error.status = 404;
        };
        const { status = 500 } = error;
        res.status(status).json({
            message: error.message,
        });
    };
};

export const createContactController = async (req, res) => {
    const { _id: userId } = req.user;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
    }


    const contact = await createContact({ ...req.body, userId, photo: photoUrl });

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};



export const patchContactController = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { contactId } = req.params;

    const photo = req.file;

    let photoUrl;

    if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
    }

    const result = await updateContact({ _id: contactId, userId }, {
        ...req.body,
        photo: photoUrl,
    });

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};



export const deleteContactController = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { contactId } = req.params;

    const contact = await deleteContact({_id: contactId, userId});
    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.status(204).send();
};


