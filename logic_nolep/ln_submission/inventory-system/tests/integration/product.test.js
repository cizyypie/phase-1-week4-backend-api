import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../setup/setupTestDB.js';

import { userOne, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken } from '../fixtures/token.fixture.js';
import { categoryOne } from '../fixtures/category.fixture.js';
import { productOne, productTwo } from '../fixtures/product.fixture.js';

setupTestDB();

describe('Product Routes', () => {
  const createCategory = async () => {
    const created = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send(categoryOne);

    return created.body.data;
  };

  describe('POST /products', () => {
    test('should return 201 and create product successfully', async () => {
      await insertUsers([userOne]);
      const category = await createCategory();

      const payload = {
        ...productOne,
        categoryId: category.id,
      };

      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(payload)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          message: 'Create Product Success',
          data: expect.objectContaining({
            id: expect.anything(),
            name: payload.name,
          }),
        })
      );
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .post('/products')
        .send(productOne)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 400 if categoryId is invalid', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productOne,
          categoryId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /products', () => {
    test('should return 200 and get products successfully', async () => {
      await insertUsers([userOne]);
      const category = await createCategory();

      await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productOne,
          categoryId: category.id,
        });

      await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productTwo,
          categoryId: category.id,
        });

      const res = await request(app)
        .get('/products?page=1&size=10')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get Products Success',
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
        .get('/products')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should filter products by category query', async () => {
      await insertUsers([userOne]);
      const category = await createCategory();

      await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productOne,
          categoryId: category.id,
        });

      const res = await request(app)
        .get('/products?category=laptop&page=1&size=10')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data).toEqual(expect.any(Array));
    });
  });

  describe('GET /products/:id', () => {
    test('should return 200 and get product by id successfully', async () => {
      await insertUsers([userOne]);
      const category = await createCategory();

      const created = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productOne,
          categoryId: category.id,
        });

      const productId = created.body.data.id;

      const res = await request(app)
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data.id).toBe(productId);
    });

    test('should return 404 if product is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

 describe('PUT /products/:id', () => {
  test('should return 200 and update product successfully', async () => {
    await insertUsers([userOne]);

    const category = await createCategory();

    const created = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        ...productOne,
        categoryId: category.id,
      });

    const productId = created.body.data.id;

    const res = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        name: 'Updated Product',
      })
      .expect(httpStatus.OK);

    expect(res.body.data.name).toBe('Updated Product');
  });

  test('should return 200 and update product category successfully', async () => {
    await insertUsers([userOne]);

    const categoryA = await createCategory();
    
    const createdCategoryB = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({ name: 'phone' });

    const categoryB = createdCategoryB.body.data;

    const created = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        ...productOne,
        categoryId: categoryA.id,
      });

    const productId = created.body.data.id;

    const res = await request(app)
      .put(`/products/${productId}`)
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        categoryId: categoryB.id,
      })
      .expect(httpStatus.OK);

    expect(res.body.data.category.id).toBe(categoryB.id);
  });

  test('should return 404 if product is not found', async () => {
    await insertUsers([userOne]);

    await request(app)
      .put('/products/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${userOneAccessToken}`)
      .send({
        name: 'Updated Product',
      })
      .expect(httpStatus.NOT_FOUND);
  });
});

  describe('DELETE /products/:id', () => {
    test('should return 200 and delete product successfully', async () => {
      await insertUsers([userOne]);
      const category = await createCategory();

      const created = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send({
          ...productOne,
          categoryId: category.id,
        });

      const productId = created.body.data.id;

      const res = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Delete Product Success',
          data: null,
        })
      );
    });

    test('should return 404 if product is not found', async () => {
      await insertUsers([userOne]);

      await request(app)
        .delete('/products/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});