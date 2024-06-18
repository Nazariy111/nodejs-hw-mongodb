import express from "express";
import { logger } from './utils/pino.js';
import cors from 'cors';
import env from './utils/env.js';
import { ENV_VARS } from "./constants/constants.js";
import { getAllContacts, getContactById } from "./services/contacts.js";



const PORT = Number(env(ENV_VARS.PORT, '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());

    app.use(logger);
    app.use(cors());

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();

        res.json({
            status: 200,
            data: contacts,
            message: "Successfully found contacts!"
        });
    });


    app.get('/contacts/:contactId', async (req, res) => {
        try {
            const { contactId } = req.params;
            const contact = await getContactById(contactId);

            if (!contact) {
                res.status(404).json({
                    message: `Contact with id ${contactId} not found`,
                });
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
    });

    app.use((req, res) => {
        res.status(404).json({
            message: "Not Found",
        });
    });


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};

