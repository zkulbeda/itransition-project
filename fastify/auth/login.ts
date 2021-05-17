import { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { z } from 'zod';
import User from '../../entity/User';
import EmailLogInError from '../../errors/Authorization/EmailLogInError';
import PasswordLogInError from '../../errors/Authorization/PasswordLogInError';
import permissions from '../../modules/permissions';

export default (app: FastifyInstance, url: string) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  type bodyType = z.infer<typeof bodySchema>

  app.post<{
    Body: bodyType
  }>(url, {
    schema: {
      body: bodySchema,
    },
  }, async (request) => {
    const userRepo = request.orm.getRepository(User);
    console.log(request.body);
    const user = await userRepo.findOne({ email: request.body.email });

    if (!user) {
      throw new EmailLogInError('There is no user with that email.');
    }
    if (!(await user.comparePassword(request.body.password))) {
      throw new PasswordLogInError('Password don\'t match');
    }
    if (permissions.user({ user }).userPermissions.can('login', 'User')) {
      throw new EmailLogInError('You have been blocked');
    }

    user.lastLogIn = DateTime.local();
    await userRepo.save(user);

    request.session.user_id = user.id;
    return { success: true };
  });
};
