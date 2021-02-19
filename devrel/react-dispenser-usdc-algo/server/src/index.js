import express from 'express';
import process from "process";
import models from './models/index.js'
import cors from 'cors';
import session from './routes/session.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    req.context = {
        currency: models.currency[1],
    };
    next();
});

app.use('/session', session);

const port = process.env.PORT || 3001

app.listen(port, () =>
    console.log(`Algorand dispenser server listening on port ${port}!`),
);
