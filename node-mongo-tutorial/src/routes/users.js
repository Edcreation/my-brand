import { Router } from 'express'
import { users, createUser, loginUser, getSingleUser, editDp, editUserName, editPassword, deleteUser } from '../controllers/users.js'
import joi from 'joi';
import { validate } from '../middleware/validation.js';
import errorMessage from '../utils/errormessage.js';
import upload from '../middleware/upload.js';
import User from '../models/usersmodel.js'
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import pkg from 'bcryptjs'
import { isLoggedIn, isLoggedInAsAdmin } from '../middleware/isLoggedIn.js';
const { hash, compare } = pkg;
const router = Router()
const SignUpSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), // password has both numbers and letters and is btn 6 and 30 
})

const NameSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
})

const PasswordSchema = joi.object().keys({
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), 
})

const LoginSchema = joi.object().keys({
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")), // password has both numbers and letters and is btn 6 and 30 
})

const PicSchema = joi.object({
    profile_pic: joi.string().required()
})

router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    },
    async (email, password, done) => {
        try {
            User.findOne({ email : email }, async (err, data) => {
                if (data) {
                    const passCheck = await compare( password, data.password )
                    if (passCheck) {
                        return done(null, data)
                    } else {
                        return done(null, false)
                    }
                } else {
                    return done(null, false)
                }
            })
        } catch(err) {
            console.log(err)
        }
    }
));
// passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/',isLoggedIn, users)

router.get('/u/:id', getSingleUser)

// User profile changes
router.put('/edit/profilepic/',isLoggedIn, upload.single("profile_pic"), editDp)
router.put('/edit/username/',isLoggedIn, validate(NameSchema, { abortEarly: false }), editUserName)
router.put('/edit/password/',isLoggedIn, validate(PasswordSchema, { abortEarly: false }), editPassword)

// Delete user changes
router.delete('/delete/:id',isLoggedInAsAdmin, deleteUser)

// User Login and Sing Up
router.post('/signup',validate(SignUpSchema), createUser);

router.post("/login", passport.authenticate("local", {
    successMessage: "loggedIn",
    failureMessage: "Not LoggedIn"
}), loginUser);

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({
        code: 200,
        message: "Logged Out",
    })
    });
});

export default router

