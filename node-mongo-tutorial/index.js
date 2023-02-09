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


const options = {
  definition: {
    openapi: "3.0.7",
    info: {
      title: "Blogs Api",
      version: "1.0.0",
      description: "Blogs, Messages and User api",
      contact: {
        name: "Mugisha Jedidiah Eddy", 
        email: "eddymugisha65@gmail.com", 
        url: "web.com",
      },
    },
    servers : {
      url: "http://127.0.0.1.5000"
    }
  },
  apis: ["./src/routes/*.js"]
}

const specs = swaggerJSDoc(options)
const app = express()
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))



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


