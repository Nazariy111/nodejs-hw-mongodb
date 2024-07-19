import express from "express";
import { logger } from './utils/pino.js';
import cors from 'cors';
import env from './utils/env.js';
import { ENV_VARS } from "./constants/constants.js";
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


const PORT = Number(env(ENV_VARS.PORT, '3000'));

export const setupServer = () => {
    const app = express();

    app.use(logger);
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());

    app.use('/api-docs', swaggerDocs());



    app.use(router);

    app.use('*', notFoundHandler);

    app.use(errorHandler);


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};

