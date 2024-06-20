import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.json({
        status: 200,
        data: contacts,
        message: "Successfully found contacts!",
    });
};


export const getContactByIdController = async (req, res,next) => {
    try {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            next(createHttpError(404, 'Student not found'));
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
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

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
    const { contactId } = req.params;

    const contact = await deleteContact(contactId);
    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };

    res.status(204).send();
};


