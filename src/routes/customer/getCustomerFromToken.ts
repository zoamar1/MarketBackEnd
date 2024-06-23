import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import authenticate from "../../utils/authenticate";

export async function getOrdersFromUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/pedidos/usuario', {
    schema: {
      summary: 'Get customer from token',
      tags: ['customer'],
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: [authenticate]
  }, async (request, reply) => {
    const userId = (request as any).user.id

    const customer = await prisma.customer.findUnique({
      where: { userId, }
    });

    if (customer.length === 0) {
      return reply.status(404).send('No order was found');
    }

    return reply.status(200).send(customer);
  });
}
