import { Strategy as PassportLocalStrategy } from 'passport-local';
import { sign } from 'jsonwebtoken';

const getStrategy = (User) => new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return done('Wrong Credentials');
    }

    const matched = await user.comparePassword(password.trim());

    if (!matched) {
      return done('Wrong Credentials');
    }

    done(null, 
      sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET));
  } catch (e) {
    console.error(e);
    done('Some unknown error');
  }
});

export default getStrategy;