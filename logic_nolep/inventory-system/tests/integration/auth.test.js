import request from 'supertest';
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import httpMocks from 'node-mocks-http';
import moment from 'moment';

import prisma from '../../prisma/index.js';
import app from '../../src/app.js';

import { userOne, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken } from '../fixtures/token.fixture.js';

import auth from '../../src/middlewares/auth.js';
import ApiError from '../../src/utils/ApiError.js';
import config from '../../src/config/config.js';
import * as tokenService from '../../src/services/tokenService.js';
import tokenTypes from '../../src/config/tokens.js';
import setupTestDB from '../setup/setupTestDB.js';

import { jest } from '@jest/globals';

setupTestDB();

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: 'user',
        password: 'password1',
      };
    });

    test('should return 201 and register user successfully', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          data: expect.any(Object),
        })
      );

      const dbUser = await prisma.user.findFirst({
        where: { email: newUser.email },
      });

      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
    });

    test('should return 400 if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if email is already used', async () => {
      await insertUsers([userOne]);

      newUser.email = userOne.email;

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password length is less than 8 characters', async () => {
      newUser.password = 'passwo1';

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password does not contain letters and numbers', async () => {
      newUser.password = 'password';

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      newUser.password = '11111111';

      await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /auth/login', () => {
    test('should return 200 and login user successfully', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: userOne.email,
          password: userOne.password,
        })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
        })
      );
    });

    test('should return 401 if password is wrong', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/auth/login')
        .send({
          email: userOne.email,
          password: 'wrongPassword1',
        })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /auth/logout', () => {
    test('should return 200 and logout successfully', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .post('/auth/logout')
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});

describe('Auth Middleware', () => {
  test('should call next with no errors if access token is valid', async () => {
    await insertUsers([userOne]);

    const req = httpMocks.createRequest({
      headers: {
        Authorization: `Bearer ${userOneAccessToken}`,
      },
    });

    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user.id).toBe(userOne.id);
  });

  test('should call next with unauthorized error if token is missing', async () => {
    const req = httpMocks.createRequest();
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  test('should call next with unauthorized error if token is invalid', async () => {
    const req = httpMocks.createRequest({
      headers: {
        Authorization: 'Bearer invalidAccessToken',
      },
    });

    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  test('should call next with unauthorized error if token is expired', async () => {
    await insertUsers([userOne]);

    const expires = moment().subtract(1, 'minutes');

    const expiredToken = tokenService.generateToken(
      userOne.id,
      expires,
      tokenTypes.ACCESS
    );

    const req = httpMocks.createRequest({
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });

    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  test('should call next with unauthorized error if token secret is invalid', async () => {
    await insertUsers([userOne]);

    const expires = moment().add(
      config.jwt.accessExpirationMinutes,
      'minutes'
    );

    const invalidSecretToken = tokenService.generateToken(
      userOne.id,
      expires,
      tokenTypes.ACCESS,
      'invalidSecret'
    );

    const req = httpMocks.createRequest({
      headers: {
        Authorization: `Bearer ${invalidSecretToken}`,
      },
    });

    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });
});