import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';

import setupTestDB from '../setup/setupTestDB.js';

import { userOne, admin, insertUsers } from '../fixtures/user.fixture.js';
import { userOneAccessToken, adminAccessToken } from '../fixtures/token.fixture.js';

import { categoryOne } from '../fixtures/category.fixture.js';
import { productOne } from '../fixtures/product.fixture.js';
import { orderOne } from '../fixtures/order.fixture.js';
import { orderItemOne, orderItemTwo } from '../fixtures/orderItem.fixture.js';

setupTestDB();

describe('OrderItem Routes', () => {
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

  const createOrder = async () => {
    const product = await createProduct();

    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        ...orderOne,
        items: [
          {
            productId: product.id,
            quantity: 1,
          },
        ],
      });

    return {
      order: res.body.data,
      product,
    };
  };

  describe('POST /order-items', () => {
    test('should return 201 and allow admin to create order item successfully', async () => {
      await insertUsers([userOne, admin]);

      const { order, product } = await createOrder();

      const payload = {
        ...orderItemOne,
        orderId: order.id,
        productId: product.id,
      };

      const res = await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(payload)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 201,
          message: 'Create OrderItem Success',
          data: expect.objectContaining({
            id: expect.anything(),
            quantity: payload.quantity,
          }),
        })
      );
    });

    test('should return 403 if normal user tries to create order item', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(orderItemOne)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 401 if token is missing', async () => {
      await request(app)
        .post('/order-items')
        .send(orderItemOne)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /order-items', () => {
    test('should return 200 and allow admin to get all order items', async () => {
      await insertUsers([userOne, admin]);

      const { order, product } = await createOrder();

      await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderItemOne,
          orderId: order.id,
          productId: product.id,
        });

      const res = await request(app)
        .get('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Get OrderItems Success',
          data: expect.any(Array),
        })
      );
    });
  });

  describe('GET /order-items/:id', () => {
    test('should return 200 and allow admin to get order item by id', async () => {
      await insertUsers([userOne, admin]);

      const { order, product } = await createOrder();

      const created = await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderItemOne,
          orderId: order.id,
          productId: product.id,
        });

      const orderItemId = created.body.data.id;

      const res = await request(app)
        .get(`/order-items/${orderItemId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.data.id).toBe(orderItemId);
    });

    test('should return 404 if order item is not found', async () => {
      await insertUsers([userOne, admin]);

      await request(app)
        .get('/order-items/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PUT /order-items/:id', () => {
    test('should return 200 and allow admin to update order item successfully', async () => {
      await insertUsers([userOne, admin]);

      const { order, product } = await createOrder();

      const created = await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderItemOne,
          orderId: order.id,
          productId: product.id,
        });

      const orderItemId = created.body.data.id;

      const res = await request(app)
        .put(`/order-items/${orderItemId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          quantity: orderItemTwo.quantity,
        })
        .expect(httpStatus.OK);

      expect(res.body.data.quantity).toBe(orderItemTwo.quantity);
    });
  });

  describe('DELETE /order-items/:id', () => {
    test('should return 200 and allow admin to delete order item successfully', async () => {
      await insertUsers([userOne, admin]);

      const { order, product } = await createOrder();

      const created = await request(app)
        .post('/order-items')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          ...orderItemOne,
          orderId: order.id,
          productId: product.id,
        });

      const orderItemId = created.body.data.id;

      const res = await request(app)
        .delete(`/order-items/${orderItemId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          status: 200,
          message: 'Delete OrderItem Success',
          data: null,
        })
      );
    });
  });
});