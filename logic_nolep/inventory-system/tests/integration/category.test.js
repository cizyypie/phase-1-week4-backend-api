import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';

import { userOne, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken } from '../fixtures/token.fixture.js';
import { categoryOne, categoryTwo } from '../fixtures/category.fixture.js';

import setupTestDB from '../setup/setupTestDB.js';

setupTestDB();

describe('Category Routes', () => {
  describe('POST /categories', () => {
    test('should return 201 and create category successfully', async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          message: 'Create Category Success',
          data: expect.objectContaining({
            id: expect.anything(),
            name: categoryOne.name,
          }),
        })
      );
    });

    test('should return 400 if category name already exists', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .post('/categories')
        .send(categoryOne)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /categories', () => {
    test('should return 200 and get categories successfully', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryTwo);

      const res = await request(app)
        .get('/categories?page=1&size=10')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get Categorys Success',
          data: expect.any(Array),
          meta: expect.objectContaining({
            total: expect.any(Number),
            totalPages: expect.any(Number),
          }),
        })
      );
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .get('/categories')
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /categories/:id', () => {
    test('should return 200 and get category by id successfully', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      const categoryId = created.body.data.id;

      const res = await request(app)
        .get(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get Category Success',
          data: expect.objectContaining({
            id: categoryId,
          }),
        })
      );
    });

    test('should return 404 if category is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 if token is missing', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      await request(app)
        .get(`/categories/${created.body.data.id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('PUT /categories/:id', () => {
    test('should return 200 and update category successfully', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      const categoryId = created.body.data.id;

      const res = await request(app)
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'Updated Category' })
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Update Category Success',
          data: expect.objectContaining({
            id: categoryId,
            name: 'Updated Category',
          }),
        })
      );
    });

    test('should return 404 if category is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .put('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({ name: 'Updated Category' })
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 if token is missing', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      await request(app)
        .put(`/categories/${created.body.data.id}`)
        .send({ name: 'Updated Category' })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /categories/:id', () => {
    test('should return 200 and delete category successfully', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      const categoryId = created.body.data.id;

      const res = await request(app)
        .delete(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Delete Category Success',
          data: null,
        })
      );
    });

    test('should return 404 if category is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete('/categories/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });

    test('should return 401 if token is missing', async () => {
      await insertUsers([userOne]);

      const created = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(categoryOne);

      await request(app)
        .delete(`/categories/${created.body.data.id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});