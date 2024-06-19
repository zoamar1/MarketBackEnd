import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import authenticate from "../../utils/authenticate";

export async function getOrdersFromUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/pedidos/usuario', {
    schema: {
      summary: 'Get orders from the logged-in customer',
      tags: ['order'],
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: [authenticate]
  }, async (request, reply) => {
    const userId = (request as any).user.id

    const ordersFromUser = await prisma.orders.findMany({
      where: { customerId: userId }
    });

    if (ordersFromUser.length === 0) {
      return reply.status(404).send('No order was found');
    }

    return reply.status(200).send(ordersFromUser);
  });
}
