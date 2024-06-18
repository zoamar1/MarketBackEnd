import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

export async function postOrder(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/pedidos', {
    schema: {
      summary: 'Create an order',
      tags: ['order'],
      body: z.object({
        productId: z.number().int(),
        customerId: z.number().int(),
        productStorageId: z.number().int(),
        status: z.string()
      }),
      response: {
        201: z.object({
          message: z.string(),
          token: z.string()
        }),
        404: z.object({
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    const { productId, customerId, productStorageId, status } = request.body;

    const [product, customer] = await Promise.all([
      prisma.products.findFirst({
        where: { id: productId }
      }),
      prisma.customers.findFirst({
        where: { id: customerId }
      })
    ]);

    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    const createOrder = await prisma.orders.create({
      data: {
        customerId,
        productId,
        productStorageId,
        status
      }
    });

    return reply.status(201).send({ message: "Pedido Criado", token: createOrder.token });
  });
}