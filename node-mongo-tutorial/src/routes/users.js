/**
 * @swagger
 * components:
 *   schemas:
 *     signup:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username of user
 *         email:
 *           type: string
 *           description: Email of user
 *         password:
 *           type: string
 *           description: Encrypted password of user
 *       example:
 *         username: mugishaeddy
 *         email: eddy@mail.com
 *         password: Qwerty@12345
 *     login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email of user
 *         password:
 *           type: string
 *           description: Encrypted password of user
 *       example:
 *         email: admin105@mail.com
 *         password: Qwert@12345
 *     response:
 *       type: object
 *       required:
 *          -code
 *       properties:
 *         code:
 *           type: integer
 *           description: The http response code
 *         message:
 *           type: string
 *           description: message of the response
 *         data:
 *           type: string
 *           description: data responded
 *       example:
 *         code: 200
 *         message: Logged In
 *         LoggedInAs: { _id: "wq323ee2e211r13r1e312e", username: "mugishaeddy", "email": "eddy@mail.com", publicId: "", imageUrl: "", admin: false}
 *     errormessage:
 *       type: object
 *       required:
 *          -code
 *       properties: 
 *         code:
 *           type: integer
 *           description: The http response code
 *         message:
 *           type: string
 *           description: message of error response
 *     editusername:
 *       type: object
 *       required:
 *          -code
 *       properties: 
 *         username:
 *           type: string
 *           description: The New Username
 *       example:
 *         username: eddymugishaupdated
 *     editusernameresponse:
 *       type: object
 *       required:
 *          -username
 *       properties: 
 *         code:
 *           type: integer
 *           description: The http response code
 *         message:
 *           type: string
 *           description: message of the response
 *         data:
 *           type: string
 *           description: data responded
 *       example:
 *         code: 200
 *         message: Logged In
 *         UpdatedUser: { _id: "wq323ee2e211r13r1e312e", username: "eddymugishaupdated", "email": "eddy@mail.com", publicId: "", imageUrl: "", admin: false}
 *     editprofilepic:
 *       type: file
 *       required:
 *          -profile_pic
 *       properties: 
 *         profile_pic:
 *           type: string
 *           format: binary
 *           description: The New profilepicture
 *     changepassword:
 *       type: object
 *       required:
 *          -password
 *       properties: 
 *         password:
 *           type: string
 *           description: The New Password
 *       example:
 *         password: newpassword
 * 
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users  api
 * /users/signup-admin:
 *   post:
 *     summary: Create a new Admin (signUp)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signup'
 *     responses:
 *       201:
 *         description: Account Created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *       409:
 *         description: User Already Exist
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 * /users/signup:
 *   post:
 *     summary: Create a new user(signUp)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signup'
 *     responses:
 *       201:
 *         description: Account Created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *       409:
 *         description: User Already Exist
 *         content: 
 *           application/json:
 *             schema:
 *               $$ref: '#/components/schemas/errormessage'
 * 
 * /users/login:
 *   post:
 *     summary: Login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: Logged In.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *         headers:
 *           Set-Cookie: 
 *             Schema:
 *               type: string
 *               example: JSESSIONID=abcde12345; Path=/; HttpOnly
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 * 
 * /users:
 *   get:
 *     summary: get all Users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users Fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 * /users/edit/username:
 *   put:
 *     summary: Update Username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/editusername'
 *     responses:
 *       200:
 *         description: Username Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/editusernameresponse'
 *       406:
 *         description: Username is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 * /users/edit/profilepic:
 *   put:
 *     summary: Update profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_pic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile Picture Updated 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/editusernameresponse'
 *       400:
 *         description: profile pic is invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 * /users/edit/password:
 *   put:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/changepassword'
 *     responses:
 *       200:
 *         description: Password Changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *       406:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete User (admin)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/response'
 *       404:
 *         description: User to delete Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errormessage'
 *
 */




import { Router } from 'express'
import { users, createUser, createAdmin, loginUser, getSingleUser, editDp, editUserName, editPassword, deleteUser } from '../controllers/users.js'
import joi from 'joi';
import { validate } from '../middleware/validation.js';
import errorMessage from '../utils/errormessage.js';
import upload from '../middleware/upload.js';
import User from '../models/usersmodel.js'
import bodyParser from 'body-parser';
import  Jwt  from 'jsonwebtoken';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTstrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJWT } from 'passport-jwt';

import pkg from 'bcryptjs'
import { isLoggedIn, isLoggedInAsAdmin } from '../middleware/isLoggedIn.js';
const { hash, compare } = pkg;
const router = Router()
const SignUpSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), // password has both numbers and letters and is btn 6 and 30 
})

const JWT_SECRET = process.env.JWT_SECRET;

const NameSchema = joi.object().keys({
    username: joi.string().min(6).max(30).required().messages(errorMessage('Username')),
})

const PasswordSchema = joi.object().keys({
    password: joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), 
})

const LoginSchema = joi.object().keys({
    email: joi.string().email().required().messages(errorMessage('Email')),
    password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[@$!%*?&])[A-Za-z0123456789@$!%*?&]{8,}$")).messages(errorMessage('Password')), // password has both numbers and letters and is btn 6 and 30 
})

const PicSchema = joi.object({
    profile_pic: joi.string().required()
})







router.use(bodyParser.json());
router.use(passport.initialize());
router.use(passport.session());

passport.use('signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
        User.findOne({ email: email },async (err, exist) => {
            if (exist) {
                done(null, false, { message : 'Email Already Exists' });
            }
            else {
                try {
                  password = await hash(req.body.password, 10);
                  const data = {
                      email: email, 
                      username: req.body.username, 
                      password: password,
                      publicId: "",
                      imageUrl: "",
                      admin: false
                  }
                  const user = new User(data);
                  user.save((err, data) => {
                      if (data) {
                          return done(null, user)
                      }
                  })
                } catch (error) {
                  done(error);
                }
            }

        })
    }
  )
);
passport.use('login',new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    },
    async (email, password, done) => {
        try {
            User.findOne({ email : email }, async (err, data) => {
                if (data) {
                    const passCheck = await compare( password, data.password )
                    if (passCheck) {
                        
                        return done(null, data, { message: "Logged In Successfully" })
                    } else {
                        return done(null, false, { message: "Password is incorrect" })
                    }
                } else {
                    return done(null, false, { message: "User not Found. Try to SignUp" })
                }
            })
        } catch(err) {
            console.log(err)
        }
    }
));
passport.use(new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('secret_token')
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/',passport.authenticate('jwt', { session: false }),isLoggedInAsAdmin, users)

router.get('/u/:id', getSingleUser)

// User profile changes
router.put('/edit/profilepic/', passport.authenticate('jwt', { session: false }), upload.single("profile_pic"), editDp)
router.put('/edit/username/', passport.authenticate('jwt', { session: false }), validate(NameSchema, { abortEarly: false }), editUserName)
router.put('/edit/password/', passport.authenticate('jwt', { session: false }), validate(PasswordSchema, { abortEarly: false }), editPassword)

// Delete user admin only
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), isLoggedInAsAdmin, deleteUser)



router.post('/signup',validate(SignUpSchema),passport.authenticate("signup", { session: false }), createUser);


router.post('/signup-admin',validate(SignUpSchema), createAdmin);

router.post('/login',validate(LoginSchema),
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
              return res.status(406).json({ code: 406, message: info.message });
            }
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
                const body = { _id: user._id,username: user.username, email: user.email, profilepic: user.imageUrl, admin: user.admin };
                const token = Jwt.sign({ user: body }, 'TOP_SECRET');
                return res.status(200).json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );
  

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

