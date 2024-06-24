import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import authenticate from "../../utils/authenticate";

export async function getLoginFromToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/login/token', {
    schema: {
      summary: 'Get the email from the logged-in customer',
      tags: ['login'],
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: [authenticate]
  }, async (request, reply) => {
    const email = (request as any).user.email

    return reply.status(200).send(email);
  });
}
