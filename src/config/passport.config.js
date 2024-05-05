const moment = require('moment');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users.model');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        //get the user data from google
        const newUser = {
          id: profile.id,
          role_id: '2',
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          register_at: moment().format('YYYY-MM-DD HH:mm')
        };

        try {
          //find the user in our database
          let user = await User.findByEmail(profile.emails[0].value);

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    done(null, user);
  });
};
