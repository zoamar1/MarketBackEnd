import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import authenticate from "../../utils/authenticate";

export async function getAddressesFromCustomer(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/endereco/usuario', {
    schema: {
      summary: 'Get the address from a customer',
      tags: ['address'],
      headers: z.object({
        authorization: z.string(),
      }),
    },
    preHandler: [authenticate],
  }, async (request, reply) => {
    const userId = (request as any).user?.id;

    if (!userId) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const getAddress = await prisma.customers.findFirst({
        where: { id: userId },
        select: { Address: true },
      });

      if (!getAddress) {
        return reply.status(404).send("No address was found");
      }

      return reply.status(200).send(getAddress);
    } catch (error) {
      console.error("Error retrieving address:", error);
      return reply.status(500).send("Internal Server Error");
    }
  });
}
