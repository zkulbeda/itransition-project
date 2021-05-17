import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import User from '../../entity/User';
import EmailLogInError from '../../errors/Authorization/EmailLogInError';
import { UserRole } from '../../schema/IUser';

export default (app: FastifyInstance, url: string) => {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
  });
  type bodyType = z.infer<typeof bodySchema>

  app.get<{ Body: bodyType }>(url, async (request) => {
    const userRepo = request.orm.getRepository(User);
    const { body } = request;
    const hasSameEmail = userRepo.findOne({
      select: ['email'],
      where: { email: body.email },
    });
    if (hasSameEmail) {
      throw new EmailLogInError('This email is currently using.');
    }
    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.userRole = UserRole.User;
    await user.setPassword(body.password);
    await userRepo.save(user);
    request.session.user_id = user.id;
    return { success: true };
  });
};
