import express, { json } from 'express';
import mongoose, { connect, set } from 'mongoose';
// routes
import users_route from './src/routes/users.js';
import blogs_route from './src/routes/blogs.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import messages_route from './src/routes/messages.js';
import dotenv from "dotenv";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import  session  from 'express-session';
import options from './docs/apidoc.js';
import cors from 'cors'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

const specs = swaggerJSDoc(options)  

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs,  { explorer: true }))

app.use(cors())


app.use(cookieParser('SercetStringForCookies'));
app.use(session({
    secret: 'SecretStringForCookies',
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}))


dotenv.config()
//mongoose connection		
mongoose.set('strictQuery', false)
connect(
    process.env.MONGO_KEY,
    {
      dbName: "Portfolio",
      useUnifiedTopology: true,
    },
    (err) =>
      err ? console.log(err) : console.log(
        "Database Connected!!!!!")
);

app.use(morgan("tiny"))
app.use(json())
app.use(bodyParser.json());
app.use('/users', users_route)
app.use('/blogs', blogs_route)
app.use('/messages', messages_route)
app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}!`))

export default app;


