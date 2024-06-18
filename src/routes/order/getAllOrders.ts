import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";


export async function getAllOrders(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/pedidos', {
    schema: {
      summary: 'Get all orders',
      tags: ['order'],
      response:{
        200:z.object({array: z.any()}),
        404:z.object({message: z.string()}),
        500:z.object({message: z.string(), error: z.any()})
      }
    }
  }, async (request, reply) => {
    try {
      const orders = await prisma.orders.findMany({})
      if (orders.length === 0) {
        return reply.status(404).send({message: "No order was found"})
      }
      return reply.status(200).send({array: orders})
    } catch (error) {
      return reply.status(500).send(
        {
          message: "Internal Server Error",
          error: error
        })
    }
  })
}