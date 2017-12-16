import { Foal } from '@foal/core';
import { getCallback } from '@foal/express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { AppModule } from './app/app.module';
import { UserService } from './app/services/user.service';

const app = express();
const foalApp = new Foal(AppModule);

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const userService = foalApp.injector.get(UserService);
      const users = await userService.getAll({ username });
      if (users.length === 0 || !userService.verifyPassword(password, users[0].password)) {
        done(null, false);
      } else {
        done(null, users[0]);
      }
    } catch (error) {
      // TODO: express should only return errors on development.
      done(error);
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await foalApp.injector.get(UserService).get(id, {});
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'my secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// The problem is the failureRedirect -> cannot GET /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.send('Authenticated!');
});

app.use(getCallback(foalApp));

app.listen(3000, () => console.log(`Listening on port 3000`));
