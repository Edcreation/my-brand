import express, { json } from 'express';
import mongoose, { connect, set } from 'mongoose';
// routes
import users_route from './src/routes/users.js';
import blogs_route from './src/routes/blogs.js';

import messages_route from './src/routes/messages.js';
import dotenv from "dotenv";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// import auth from './src/middleware/authenticate.js';
// import LocalStrategy from 'passport-local'
// import User from './src/models/usersmodel.js';
// import passport from 'passport';
import  session  from 'express-session';
const app = express()



app.use(cookieParser('SercetStringForCookies'));
app.use(session({
    secret: 'SecretStringForCookies',
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true
}))


dotenv.config()
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

app.use(morgan("tiny"))
app.use(json())
app.use(bodyParser.json());
app.use('/users', users_route)
app.use('/blogs', blogs_route)
app.use('/messages', messages_route)
app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}!`))

export default app;


