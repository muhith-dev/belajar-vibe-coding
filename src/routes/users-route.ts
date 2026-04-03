import { Elysia, t } from 'elysia';
import { UserService } from '../services/users-service';

export const userRoutes = new Elysia({ prefix: '/api' })
  .derive(({ headers }) => {
    const auth = headers['authorization'];
    const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
    return { token };
  })
  .post('/users', async ({ body, set }) => {
    const result = await UserService.registerUser(body);

    if (!result.success) {
      set.status = 400;
      return { data: result.message };
    }

    return { data: 'OK' };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
  })
  .post('/users/login', async ({ body, set }) => {
    const result = await UserService.loginUser(body);

    if (!result.success) {
      set.status = 401;
      return { data: result.message };
    }

    return { data: result.token };
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String(),
    }),
  })
  .get('/users/current', async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { data: 'Unauthorized' };
    }

    const result = await UserService.getCurrentUser(token);

    if (!result.success) {
      set.status = 401;
      return { data: 'Unauthorized' };
    }

    return { data: result.data };
  })
  .delete('/users/logout', async ({ token, set }) => {
    if (!token) {
      set.status = 401;
      return { data: 'Unauthorized' };
    }

    try {
      await UserService.logoutUser(token);
      return { data: 'oke' };
    } catch (error) {
      set.status = 500;
      return { data: 'Internal Server Error' };
    }
  });
