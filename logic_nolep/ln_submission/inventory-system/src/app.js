import express from 'express';
import router from './routes/index.js';
import config from './config/config.js';
import { successHandler, errorHandler as morganErrorHandler } from './config/morgan.js';
import { errorConverter, errorHandler } from './middlewares/error.js';
import ApiError from './utils/ApiError.js';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import { jwtStrategy } from './config/passport.js';
import passport from 'passport';
import status from 'http-status';

const app = express();

if (config.env !== 'test') {
  app.use(successHandler);
  app.use(morganErrorHandler);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());
app.use(cors());
app.options('*', cors());
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.get('/', (req, res) => {res.send('hello world')});
app.use('/', router);
app.use((req, res, next) => {
  next(new ApiError(status.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
