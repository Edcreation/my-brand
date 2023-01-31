import express, { json } from 'express';
const app = express()

// mongo db and mockgoose for
import mongoose, { connect, set } from 'mongoose';
import { Mockgoose } from 'mockgoose';
var mockgoose = new Mockgoose(mongoose);

// routes
import users_route from './routes/users.js';
import blogs_route from './routes/blogs.js';

import messages_route from './routes/messages.js';
import dotenv from "dotenv";
import morgan from 'morgan';
import bodyParser from 'body-parser';


//mongoose connection		
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
set('strictQuery', true);
app.use(morgan("tiny"))
app.use(json())
app.use(bodyParser.json());

app.use('/users', users_route)
app.use('/blogs', blogs_route)
app.use('/messages', messages_route)
app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}!`))

export default app;


