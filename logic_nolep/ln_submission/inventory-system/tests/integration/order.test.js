import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../setup/setupTestDB.js';

import { userOne, admin, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken, adminAccessToken } from '../fixtures/token.fixture.js';

import { categoryOne } from '../fixtures/category.fixture.js';
import { productOne } from '../fixtures/product.fixture.js';
import { orderOne } from '../fixtures/order.fixture.js';

setupTestDB();

describe('Order Routes', () => {
  const createCategory = async () => {
    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(categoryOne);

    return res.body.data;
  };

  const createProduct = async () => {
    const category = await createCategory();

    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        ...productOne,
        categoryId: category.id,
      });

    return res.body.data;
  };

  describe('POST /orders', () => {
    test('should return 201 and allow admin to create order successfully', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      const payload = {
        ...orderOne,
        items: [
          {
            productId: product.id,
            quantity: 2,
          },
        ],
      };

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(payload)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          message: 'Create Order Success',
          data: expect.any(Object),
        })
      );
    });

    test('should return 403 if normal user tries to create order', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(orderOne)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .post('/orders')
        .send(orderOne)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /orders', () => {
    test('should return 200 and allow admin to get all orders', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderOne,
          items: [{ productId: product.id, quantity: 2 }],
        });

      const res = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get Orders Success',
          data: expect.any(Array),
        })
      );
    });

    test('should return 403 if normal user tries to get all orders', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /orders/:id', () => {
    test('should return 200 and allow admin to get order by id', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      const created = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderOne,
          items: [{ productId: product.id, quantity: 2 }],
        });

      const orderId = created.body.data.id;

      const res = await request(app)
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data.id).toBe(orderId);
    });

    test('should return 404 if order is not found', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .get('/orders/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /orders/:id', () => {
    test('should return 200 and allow admin to update order successfully', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      const created = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderOne,
          items: [{ productId: product.id, quantity: 2 }],
        });

      const orderId = created.body.data.id;

      const res = await request(app)
        .put(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          customerName: 'Updated Customer',
        })
        .expect(httpStatus.OK);

      expect(res.body.data.customerName).toBe('Updated Customer');
    });
  });

  describe('DELETE /orders/:id', () => {
    test('should return 200 and allow admin to delete order successfully', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      const created = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderOne,
          items: [{ productId: product.id, quantity: 2 }],
        });

      const orderId = created.body.data.id;

      await request(app)
        .delete(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);
    });
  });

  describe('GET /orders/:id/order-items', () => {
    test('should return 200 and allow admin to get order items successfully', async () => {
      await insertUsers([userOne, admin]);

      const product = await createProduct();

      const created = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderOne,
          items: [{ productId: product.id, quantity: 2 }],
        });

      const orderId = created.body.data.id;

      const res = await request(app)
        .get(`/orders/${orderId}/order-items`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          data: expect.any(Array),
        })
      );
    });
  });
});