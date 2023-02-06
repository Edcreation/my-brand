import passport from 'passport';
import LocalStrategy from 'passport-local'
import Users from './src/models/usersmodel.js';
LocalStrategy.Strategy
passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());