import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../setup/setupTestDB.js';
import { userOne, admin, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken, adminAccessToken } from '../fixtures/token.fixture.js';

setupTestDB();

describe('Users access', () => {
  describe('GET /users', () => {
    test('should return 200 and allow admin to get all users', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app).get('/users').set('Authorization', `Bearer ${adminAccessToken}`).expect(httpStatus.OK);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          data: expect.any(Array),
        }),
      );

      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test('should return 401 if token is missing', async () => {
      await insertUsers([userOne, admin]);
      await request(app).get('/users').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if token is invalid', async () => {
      await insertUsers([userOne, admin]);
      await request(app).get('/users').set('Authorization', `Bearer invalidAccessToken`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if normal user tries to get all users', async () => {
      await insertUsers([userOne, admin]);
      await request(app).get('/users').set('Authorization', `Bearer ${userOneAccessToken}`).expect(httpStatus.FORBIDDEN);
    });

    test('should return paginated users successfully', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .get('/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get All Users Success',
          data: expect.any(Array),
        }),
      );
    });
  });

  describe('GET /users/:id', () => {
    test('should return 200 and allow admin to get a user info', async () => {
      await insertUsers([userOne, admin]);

      const res = await request(app)
        .get(`/users/${userOne.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          data: expect.any(Object),
        }),
      );
    });

    test('should return 401 if token is missing', async () => {
      await insertUsers([userOne, admin]);

      await request(app).get(`/users/${userOne.id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if normal user tries to get a user info', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .get(`/users/${userOne.id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 if user is not found', async () => {
      await insertUsers([admin]);

      await request(app)
        .get('/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /users/:id', () => {
  test('should return 200 and allow admin to update user info', async () => {
    await insertUsers([userOne, admin]);

    const res = await request(app)
      .put(`/users/${userOne.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        name: 'Updated User',
      })
      .expect(httpStatus.OK);

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 200,
      })
    );
  });

  test('should return 401 if token is missing', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .put(`/users/${userOne.id}`)
      .send({ name: 'Updated User' })
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 if normal user tries to update user', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .put(`/users/${userOne.id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({ name: 'Updated User' })
      .expect(httpStatus.FORBIDDEN);
  });
});

describe('DELETE /users/:id', () => {
  test('should return 200 and allow admin to delete user', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .delete(`/users/${userOne.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(httpStatus.OK);
  });

  test('should return 401 if token is missing', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .delete(`/users/${userOne.id}`)
      .expect(httpStatus.UNAUTHORIZED);
  });

  test('should return 403 if normal user tries to delete user', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .delete(`/users/${userOne.id}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .expect(httpStatus.FORBIDDEN);
  });
});

describe('GET /users/:id/products', () => {
  test('should return 200 and get products by user id', async () => {
    await insertUsers([userOne, admin]);

    const res = await request(app)
      .get(`/users/${userOne.id}/products`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(httpStatus.OK);

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 200,
        data: expect.any(Array),
      })
    );
  });

  test('should return 401 if token is missing', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .get(`/users/${userOne.id}/products`)
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /users/:id/orders', () => {
  test('should return 200 and get orders by user id', async () => {
    await insertUsers([userOne, admin]);

    const res = await request(app)
      .get(`/users/${userOne.id}/orders`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(httpStatus.OK);

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 200,
        data: expect.any(Array),
      })
    );
  });

  test('should return 401 if token is missing', async () => {
    await insertUsers([userOne, admin]);

    await request(app)
      .get(`/users/${userOne.id}/orders`)
      .expect(httpStatus.UNAUTHORIZED);
  });
});
});
