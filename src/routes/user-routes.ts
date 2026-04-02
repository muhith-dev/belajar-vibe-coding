import { Elysia, t } from 'elysia';
import { UserService } from '../services/user-services';

export const userRoutes = new Elysia({ prefix: '/api' })
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
  });
